import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getCurrentUser();
    if (!session) {
      return NextResponse.json({ user: null });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      include: {
        customerProfile: true,
        workerProfile: {
          include: {
            primaryCategory: true,
            services: true,
          },
        },
      },
    });

    if (!user || !user.isActive) {
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatarUrl: user.avatarUrl,
        city: user.city,
        locality: user.locality,
        workerProfile: user.workerProfile,
        customerProfile: user.customerProfile,
      },
    });
  } catch (error) {
    return NextResponse.json({ user: null });
  }
}
