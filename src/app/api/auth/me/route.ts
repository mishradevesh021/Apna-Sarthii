import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { initialUsers } from '@/lib/mock-db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getCurrentUser();
    if (!session) {
      return NextResponse.json({ user: null });
    }

    let user: any = null;

    try {
      user = await prisma.user.findUnique({
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
    } catch {
      // ignore
    }

    if (!user) {
      const mock = initialUsers.find((u) => u.id === session.userId || u.email === session.email);
      if (mock) {
        user = {
          id: mock.id,
          name: mock.name,
          email: mock.email,
          phone: mock.phone,
          role: mock.role,
          avatarUrl: null,
          city: mock.city,
          locality: mock.locality,
          workerProfile: mock.workerProfile,
          customerProfile: mock.customerProfile,
        };
      }
    }

    if (!user) {
      return NextResponse.json({
        user: {
          id: session.userId,
          name: session.name,
          email: session.email,
          role: session.role,
          city: 'Prayagraj',
          locality: 'Civil Lines',
        },
      });
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
