import { NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

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

    // Fetch existing request
    const existing = await prisma.serviceRequest.findUnique({
      where: { id },
      include: { customer: true, worker: true },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Service request not found' }, { status: 404 });
    }

    // Role-based authorization guard
    const isCustomer = existing.customerId === session.userId;
    const isWorker = existing.workerId === session.userId;
    const isAdmin = session.role === 'ADMIN';

    if (!isCustomer && !isWorker && !isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Customers can only cancel if not completed
    if (isCustomer && status !== 'CANCELLED') {
      return NextResponse.json(
        { error: 'Customers can only cancel requests.' },
        { status: 400 }
      );
    }

    // Update request and append timeline
    const updated = await prisma.$transaction(async (tx) => {
      const reqUpdated = await tx.serviceRequest.update({
        where: { id },
        data: {
          status,
          cancelReason: status === 'CANCELLED' || status === 'DECLINED' ? note : undefined,
        },
      });

      await tx.jobTimeline.create({
        data: {
          serviceRequestId: id,
          status,
          note: note || `Status updated to ${status.replace(/_/g, ' ')}`,
          actorId: session.userId,
        },
      });

      // If completed, increment worker completed jobs count
      if (status === 'COMPLETED') {
        await tx.workerProfile.updateMany({
          where: { userId: existing.workerId },
          data: {
            completedJobs: { increment: 1 },
          },
        });
      }

      return reqUpdated;
    });

    // Send notifications based on the transition
    if (isWorker) {
      let notifyTitle = `Job Update: ${status.replace(/_/g, ' ')}`;
      let notifyMsg = `${existing.worker.name} updated status to ${status.replace(/_/g, ' ')}.`;

      if (status === 'ACCEPTED') {
        notifyTitle = '🎉 Request Accepted!';
        notifyMsg = `${existing.worker.name} has accepted your service request!`;
      } else if (status === 'ON_THE_WAY') {
        notifyTitle = '🚗 Professional On The Way';
        notifyMsg = `${existing.worker.name} is on the way to your location.`;
      } else if (status === 'ARRIVED') {
        notifyTitle = '📍 Professional Arrived';
        notifyMsg = `${existing.worker.name} has arrived at your address.`;
      } else if (status === 'IN_PROGRESS') {
        notifyTitle = '⚡ Work In Progress';
        notifyMsg = `${existing.worker.name} has started working on the issue.`;
      } else if (status === 'COMPLETED') {
        notifyTitle = '✅ Job Completed';
        notifyMsg = `Work completed by ${existing.worker.name}. Please rate your experience!`;
      }

      await prisma.notification.create({
        data: {
          userId: existing.customerId,
          title: notifyTitle,
          message: notifyMsg,
          type: 'STATUS_UPDATE',
          link: '/requests',
        },
      });
    } else if (isCustomer && status === 'CANCELLED') {
      await prisma.notification.create({
        data: {
          userId: existing.workerId,
          title: 'Request Cancelled',
          message: `Customer ${existing.customer.name} cancelled the request.`,
          type: 'STATUS_UPDATE',
          link: '/worker/dashboard',
        },
      });
    }

    return NextResponse.json({
      success: true,
      request: updated,
    });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Update request status error:', error);
    return NextResponse.json(
      { error: 'Failed to update service request status.' },
      { status: 500 }
    );
  }
}
