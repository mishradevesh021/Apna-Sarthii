import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireRole } from '@/lib/auth';

export async function PATCH(req: Request) {
  try {
    const session = await requireRole(['WORKER', 'ADMIN']);
    const body = await req.json();

    const {
      isAvailable,
      emergency24x7,
      startingPrice,
      serviceRadiusKm,
      workingHours,
      bio,
    } = body;

    const updated = await prisma.workerProfile.update({
      where: { userId: session.userId },
      data: {
        ...(typeof isAvailable === 'boolean' ? { isAvailable } : {}),
        ...(typeof emergency24x7 === 'boolean' ? { emergency24x7 } : {}),
        ...(startingPrice ? { startingPrice: Number(startingPrice) } : {}),
        ...(serviceRadiusKm ? { serviceRadiusKm: Number(serviceRadiusKm) } : {}),
        ...(workingHours ? { workingHours } : {}),
        ...(bio !== undefined ? { bio } : {}),
      },
    });

    return NextResponse.json({ success: true, profile: updated });
  } catch (error: any) {
    if (error.message === 'FORBIDDEN' || error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
