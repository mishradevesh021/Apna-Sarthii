import { NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { inMemoryRequests } from '@/lib/mock-db';

export const dynamic = 'force-dynamic';

const updateStatusSchema = z.object({
  status: z.enum([
    'REQUESTED',
    'ACCEPTED',
    'DECLINED',
    'ON_THE_WAY',
    'ARRIVED',
    'IN_PROGRESS',
    'COMPLETED',
    'CANCELLED',
  ]),
  note: z.string().optional(),
});

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAuth();
    const { id } = params;

    const body = await req.json();
    const result = updateStatusSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 }
      );
    }

    const { status, note } = result.data;
    let updated: any = null;

    try {
      updated = await prisma.$transaction(async (tx) => {
        const reqUpdated = await tx.serviceRequest.update({
          where: { id },
          data: { status, cancelReason: status === 'CANCELLED' || status === 'DECLINED' ? note : undefined },
        });

        await tx.jobTimeline.create({
          data: {
            serviceRequestId: id,
            status,
            note: note || `Status updated to ${status.replace(/_/g, ' ')}`,
            actorId: session.userId,
          },
        });
        return reqUpdated;
      });
    } catch {
      // fallback in-memory update
      const existing = inMemoryRequests.find((r) => r.id === id);
      if (existing) {
        existing.status = status as any;
        if (!existing.timeline) existing.timeline = [];
        existing.timeline.push({
          id: `tl-${Date.now()}`,
          status: status as any,
          note: note || `Status updated to ${status.replace(/_/g, ' ')}`,
          createdAt: new Date().toISOString(),
        });
        updated = existing;
      }
    }

    return NextResponse.json({
      success: true,
      request: updated || { id, status },
    });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to update status' }, { status: 500 });
  }
}
