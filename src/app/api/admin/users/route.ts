import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireRole } from '@/lib/auth';
import { initialUsers, initialWorkers } from '@/lib/mock-db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await requireRole(['ADMIN']);

    let usersList: any[] = [];

    try {
      usersList = await prisma.user.findMany({
        include: {
          workerProfile: {
            include: { primaryCategory: true },
          },
          customerProfile: true,
        },
        orderBy: { createdAt: 'desc' },
      });
    } catch {
      // ignore
    }

    if (usersList.length === 0) {
      // Combine mock users with worker details
      usersList = initialUsers.map((u) => {
        const workerInfo = initialWorkers.find((w) => w.userId === u.id);
        return {
          id: u.id,
          name: u.name,
          email: u.email,
          phone: u.phone,
          role: u.role,
          city: u.city,
          locality: u.locality,
          workerProfile: workerInfo
            ? {
                rating: workerInfo.rating,
                completedJobs: workerInfo.completedJobs,
                isVerified: workerInfo.isVerified,
                primaryCategory: { name: workerInfo.categoryName },
              }
            : null,
          createdAt: new Date().toISOString(),
        };
      });

      // Also add remaining workers
      initialWorkers.forEach((w) => {
        if (!usersList.some((u) => u.name === w.name)) {
          usersList.push({
            id: w.userId || w.id,
            name: w.name,
            email: `${w.name.toLowerCase().replace(/\s+/g, '.')}.pro@sarthi.local`,
            phone: '+91 98765 22000',
            role: 'WORKER',
            city: w.city,
            locality: w.locality,
            workerProfile: {
              rating: w.rating,
              completedJobs: w.completedJobs,
              isVerified: w.isVerified,
              primaryCategory: { name: w.categoryName },
            },
            createdAt: new Date().toISOString(),
          });
        }
      });
    }

    return NextResponse.json({ users: usersList });
  } catch (error: any) {
    if (error.message === 'FORBIDDEN' || error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Access Denied: Admin role required' }, { status: 403 });
    }
    return NextResponse.json({ users: initialUsers });
  }
}
