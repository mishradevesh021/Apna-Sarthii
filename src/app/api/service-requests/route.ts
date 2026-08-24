import { NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

const createRequestSchema = z.object({
  workerId: z.string().min(1, 'Worker ID is required'),
  serviceCategoryId: z.string().min(1, 'Service Category ID is required'),
  problemTitle: z.string().min(3, 'Problem title must be at least 3 characters'),
  problemDescription: z.string().min(5, 'Please provide a brief problem description'),
  urgency: z.enum(['ASAP', 'TODAY', 'TOMORROW', 'CUSTOM']).default('TODAY'),
  scheduledTime: z.string().default('ASAP'),
  locationAddress: z.string().min(5, 'Location address is required'),
  locationCity: z.string().default('Prayagraj'),
  locationLocality: z.string().default('Civil Lines'),
  estimatedBudget: z.number().optional(),
  images: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const session = await requireAuth();

    const body = await req.json();
    const result = createRequestSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 }
      );
    }

    const {
      workerId,
      serviceCategoryId,
      problemTitle,
      problemDescription,
      urgency,
      scheduledTime,
      locationAddress,
      locationCity,
      locationLocality,
      estimatedBudget,
      images,
    } = result.data;

    const worker = await prisma.user.findUnique({
      where: { id: workerId },
      include: { workerProfile: true },
    });

    if (!worker || worker.role !== 'WORKER') {
      return NextResponse.json(
        { error: 'Specified professional could not be found.' },
        { status: 404 }
      );
    }

    const newRequest = await prisma.serviceRequest.create({
      data: {
        customerId: session.userId,
        workerId: worker.id,
        serviceCategoryId,
        problemTitle,
        problemDescription,
        urgency,
        scheduledTime,
        locationAddress,
        locationCity,
        locationLocality,
        estimatedBudget: estimatedBudget || null,
        images: images || null,
        status: 'REQUESTED',
        timeline: {
          create: {
            status: 'REQUESTED',
            note: 'Service request created by customer.',
            actorId: session.userId,
          },
        },
      },
      include: {
        customer: true,
        worker: true,
        serviceCategory: true,
        timeline: true,
      },
    });

    await prisma.notification.create({
      data: {
        userId: worker.id,
        title: '🔔 New Service Request!',
        message: `${session.name} requested "${problemTitle}" in ${locationLocality}.`,
        type: 'REQUEST_NEW',
        link: '/worker/dashboard',
      },
    });

    return NextResponse.json({
      success: true,
      request: newRequest,
    });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Please sign in to place a request.' }, { status: 401 });
    }
    console.error('Create request error:', error);
    return NextResponse.json(
      { error: 'Failed to create service request. Please try again.' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const session = await requireAuth();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    const where: any = {};
    if (session.role === 'WORKER') {
      where.workerId = session.userId;
    } else if (session.role === 'CUSTOMER') {
      where.customerId = session.userId;
    } else if (session.role !== 'ADMIN') {
      where.customerId = session.userId;
    }

    if (status) {
      where.status = status;
    }

    const requests = await prisma.serviceRequest.findMany({
      where,
      include: {
        customer: {
          select: { id: true, name: true, phone: true, email: true, city: true, locality: true },
        },
        worker: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true,
            avatarUrl: true,
            workerProfile: {
              select: { rating: true, startingPrice: true, isVerified: true },
            },
          },
        },
        serviceCategory: true,
        timeline: {
          orderBy: { createdAt: 'asc' },
        },
        review: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ requests });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Error fetching requests:', error);
    return NextResponse.json({ error: 'Failed to fetch requests' }, { status: 500 });
  }
}
