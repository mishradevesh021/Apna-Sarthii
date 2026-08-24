import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { initialWorkers, inMemoryRequests } from '@/lib/mock-db';

export const dynamic = 'force-dynamic';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    let worker: any = null;
    let reviews: any[] = [];

    try {
      worker = await prisma.workerProfile.findFirst({
        where: {
          OR: [{ id }, { userId: id }],
          user: { isActive: true },
        },
        include: {
          user: true,
          primaryCategory: true,
          services: true,
        },
      });

      if (worker) {
        reviews = await prisma.review.findMany({
          where: { workerId: worker.userId },
          include: {
            customer: { select: { name: true, city: true, locality: true, avatarUrl: true } },
            serviceRequest: { select: { problemTitle: true, createdAt: true } },
          },
          orderBy: { createdAt: 'desc' },
          take: 20,
        });
      }
    } catch {
      // ignore
    }

    if (!worker) {
      const mock = initialWorkers.find((w) => w.id === id || w.userId === id) || initialWorkers[0];
      return NextResponse.json({
        worker: {
          id: mock.id,
          userId: mock.userId,
          name: mock.name,
          avatarUrl: mock.avatarUrl,
          category: { name: mock.categoryName, slug: mock.categorySlug },
          city: mock.city,
          locality: mock.locality,
          bio: `Experienced ${mock.categoryName} serving ${mock.locality} with ${mock.experienceYears} years of trusted field work.`,
          experienceYears: mock.experienceYears,
          startingPrice: mock.startingPrice,
          serviceRadiusKm: 10.0,
          rating: mock.rating,
          reviewCount: mock.reviewCount,
          completedJobs: mock.completedJobs,
          responseRate: mock.responseRate,
          isAvailable: mock.isAvailable,
          isVerified: mock.isVerified,
          identityVerified: mock.identityVerified,
          professionVerified: mock.professionVerified,
          workingHours: '8:00 AM - 8:00 PM',
          emergency24x7: mock.emergency24x7,
          services: [
            {
              id: 'srv-std',
              customTitle: `${mock.categoryName} Standard Inspection & Quick Fix`,
              price: mock.startingPrice,
              description: 'Doorstep inspection, problem diagnosis and basic repair',
            },
          ],
        },
        reviews: [
          {
            id: 'rev-1',
            customerName: 'Priya Singh',
            customerLocality: 'Civil Lines',
            problemTitle: 'Standard Service Fix',
            ratingOverall: 5.0,
            ratingPunctuality: 5.0,
            ratingQuality: 5.0,
            ratingValue: 5.0,
            comment: 'Very professional, arrived on time and resolved the issue quickly with fair pricing.',
            createdAt: new Date().toISOString(),
          },
        ],
      });
    }

    return NextResponse.json({
      worker: {
        id: worker.id,
        userId: worker.userId,
        name: worker.user.name,
        avatarUrl: worker.user.avatarUrl,
        category: worker.primaryCategory,
        city: worker.user.city,
        locality: worker.user.locality,
        bio: worker.bio,
        experienceYears: worker.experienceYears,
        startingPrice: worker.startingPrice,
        serviceRadiusKm: worker.serviceRadiusKm,
        rating: worker.rating,
        reviewCount: worker.reviewCount,
        completedJobs: worker.completedJobs,
        responseRate: worker.responseRate,
        isAvailable: worker.isAvailable,
        isVerified: worker.isVerified,
        identityVerified: worker.identityVerified,
        professionVerified: worker.professionVerified,
        workingHours: worker.workingHours,
        emergency24x7: worker.emergency24x7,
        latitude: worker.latitude,
        longitude: worker.longitude,
        services: worker.services,
      },
      reviews: reviews.map((r) => ({
        id: r.id,
        customerName: r.customer.name,
        customerLocality: r.customer.locality,
        problemTitle: r.serviceRequest.problemTitle,
        ratingOverall: r.ratingOverall,
        ratingPunctuality: r.ratingPunctuality,
        ratingQuality: r.ratingQuality,
        ratingValue: r.ratingValue,
        comment: r.comment,
        createdAt: r.createdAt,
      })),
    });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to load profile' }, { status: 500 });
  }
}
