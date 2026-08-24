import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireRole } from '@/lib/auth';

export async function GET() {
  try {
    await requireRole(['ADMIN']);

    const [
      totalUsers,
      totalWorkers,
      totalCustomers,
      totalRequests,
      completedJobs,
      pendingVerifications,
      pendingReports,
      categories,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: 'WORKER' } }),
      prisma.user.count({ where: { role: 'CUSTOMER' } }),
      prisma.serviceRequest.count(),
      prisma.serviceRequest.count({ where: { status: 'COMPLETED' } }),
      prisma.workerProfile.count({ where: { isVerified: false } }),
      prisma.report.count({ where: { status: 'PENDING' } }),
      prisma.serviceCategory.findMany({
        include: {
          _count: { select: { workers: true, requests: true } },
        },
      }),
    ]);

    // Calculate approximate GMV from completed requests
    const completedList = await prisma.serviceRequest.findMany({
      where: { status: 'COMPLETED' },
      select: { estimatedBudget: true },
    });

    const totalGMV = completedList.reduce(
      (sum, r) => sum + (r.estimatedBudget || 350),
      0
    );

    return NextResponse.json({
      stats: {
        totalUsers,
        totalWorkers,
        totalCustomers,
        totalRequests,
        completedJobs,
        pendingVerifications,
        pendingReports,
        totalGMV,
      },
      categories,
    });
  } catch (error: any) {
    if (error.message === 'FORBIDDEN' || error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Access Denied: Admin role required' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Failed to fetch admin stats' }, { status: 500 });
  }
}
