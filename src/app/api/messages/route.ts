import { NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

const sendMessageSchema = z.object({
  serviceRequestId: z.string().min(1),
  content: z.string().min(1, 'Message cannot be empty'),
  mediaUrl: z.string().optional(),
});

export async function GET(req: Request) {
  try {
    const session = await requireAuth();
    const { searchParams } = new URL(req.url);
    const serviceRequestId = searchParams.get('serviceRequestId');

    if (!serviceRequestId) {
      return NextResponse.json({ error: 'Service Request ID required' }, { status: 400 });
    }

    // Verify request access
    const request = await prisma.serviceRequest.findUnique({
      where: { id: serviceRequestId },
    });

    if (!request || (request.customerId !== session.userId && request.workerId !== session.userId && session.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const messages = await prisma.message.findMany({
      where: { serviceRequestId },
      include: {
        sender: {
          select: { id: true, name: true, avatarUrl: true, role: true },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json({ messages });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await requireAuth();
    const body = await req.json();
    const result = sendMessageSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error.errors[0].message }, { status: 400 });
    }

    const { serviceRequestId, content, mediaUrl } = result.data;

    const request = await prisma.serviceRequest.findUnique({
      where: { id: serviceRequestId },
      include: { customer: true, worker: true },
    });

    if (!request || (request.customerId !== session.userId && request.workerId !== session.userId)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const receiverId = session.userId === request.customerId ? request.workerId : request.customerId;

    const message = await prisma.message.create({
      data: {
        serviceRequestId,
        senderId: session.userId,
        receiverId,
        content,
        mediaUrl: mediaUrl || null,
      },
      include: {
        sender: {
          select: { id: true, name: true, avatarUrl: true, role: true },
        },
      },
    });

    // Create message notification
    await prisma.notification.create({
      data: {
        userId: receiverId,
        title: `💬 New message from ${session.name}`,
        message: content.length > 50 ? `${content.slice(0, 50)}...` : content,
        type: 'MESSAGE_NEW',
        link: `/messages?requestId=${serviceRequestId}`,
      },
    });

    return NextResponse.json({ success: true, message });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
