import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireRole } from '@/lib/auth';

export async function GET() {
  try {
    await requireRole(['ADMIN']);

    const workers = await prisma.workerProfile.findMany({
      include: {
        user: true,
        primaryCategory: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ workers });
  } catch (error: any) {
    if (error.message === 'FORBIDDEN' || error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Access Denied' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Failed to fetch workers' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await requireRole(['ADMIN']);
    const { workerProfileId, isVerified, identityVerified, professionVerified } = await req.json();

    const updated = await prisma.workerProfile.update({
      where: { id: workerProfileId },
      data: {
        isVerified: isVerified ?? true,
        identityVerified: identityVerified ?? true,
        professionVerified: professionVerified ?? true,
      },
      include: { user: true },
    });

    await prisma.adminAction.create({
      data: {
        adminId: session.userId,
        targetUserId: updated.userId,
        actionType: isVerified ? 'VERIFY_WORKER' : 'UNVERIFY_WORKER',
        notes: `Worker ${updated.user.name} verification status set to ${isVerified ? 'VERIFIED' : 'UNVERIFIED'}.`,
      },
    });

    // Notify the worker
    await prisma.notification.create({
      data: {
        userId: updated.userId,
        title: isVerified ? '🎉 Verification Approved!' : 'Verification Status Updated',
        message: isVerified
          ? 'Your Sarthi Professional profile is officially verified with the blue trust badge.'
          : 'Your verification status has been updated by the administration team.',
        type: 'SYSTEM',
        link: '/worker/dashboard',
      },
    });

    return NextResponse.json({ success: true, profile: updated });
  } catch (error: any) {
    if (error.message === 'FORBIDDEN' || error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Access Denied' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Failed to update verification' }, { status: 500 });
  }
}
