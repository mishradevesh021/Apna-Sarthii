import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Worker profile can be looked up by WorkerProfile id or User id
    const worker = await prisma.workerProfile.findFirst({
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

    if (!worker) {
      return NextResponse.json({ error: 'Worker not found' }, { status: 404 });
    }

    // Fetch verified reviews for this worker
    const reviews = await prisma.review.findMany({
      where: { workerId: worker.userId },
      include: {
        customer: {
          select: { name: true, city: true, locality: true, avatarUrl: true },
        },
        serviceRequest: {
          select: { problemTitle: true, createdAt: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

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
    console.error('Error fetching worker profile:', error);
    return NextResponse.json({ error: 'Failed to load profile' }, { status: 500 });
  }
}
