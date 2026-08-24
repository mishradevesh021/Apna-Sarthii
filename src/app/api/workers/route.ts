import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { rankAndScoreWorkers, WorkerCandidate } from '@/lib/matching';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const categorySlug = searchParams.get('category');
    const query = searchParams.get('q')?.toLowerCase();
    const availableOnly = searchParams.get('available') === 'true';
    const verifiedOnly = searchParams.get('verified') === 'true';
    const emergencyOnly = searchParams.get('emergency') === 'true';
    const minRating = parseFloat(searchParams.get('minRating') || '0');
    const sortBy = searchParams.get('sortBy') || 'match';
    const userLat = parseFloat(searchParams.get('lat') || '25.4358');
    const userLng = parseFloat(searchParams.get('lng') || '81.8463');

    const where: any = {
      user: {
        isActive: true,
      },
    };

    if (categorySlug && categorySlug !== 'all') {
      where.primaryCategory = { slug: categorySlug };
    }

    if (availableOnly) {
      where.isAvailable = true;
    }

    if (verifiedOnly) {
      where.isVerified = true;
    }

    if (emergencyOnly) {
      where.emergency24x7 = true;
    }

    if (minRating > 0) {
      where.rating = { gte: minRating };
    }

    if (query) {
      where.OR = [
        { user: { name: { contains: query } } },
        { user: { locality: { contains: query } } },
        { bio: { contains: query } },
        { primaryCategory: { name: { contains: query } } },
        {
          services: {
            some: {
              customTitle: { contains: query },
            },
          },
        },
      ];
    }

    const workers = await prisma.workerProfile.findMany({
      where,
      include: {
        user: true,
        primaryCategory: true,
      },
    });

    const candidates: WorkerCandidate[] = workers.map((w) => ({
      id: w.id,
      userId: w.userId,
      name: w.user.name,
      avatarUrl: w.user.avatarUrl,
      categoryName: w.primaryCategory.name,
      categorySlug: w.primaryCategory.slug,
      city: w.user.city,
      locality: w.user.locality,
      startingPrice: w.startingPrice,
      rating: w.rating,
      reviewCount: w.reviewCount,
      completedJobs: w.completedJobs,
      experienceYears: w.experienceYears,
      responseRate: w.responseRate,
      isAvailable: w.isAvailable,
      isVerified: w.isVerified,
      identityVerified: w.identityVerified,
      professionVerified: w.professionVerified,
      emergency24x7: w.emergency24x7,
      latitude: w.latitude,
      longitude: w.longitude,
    }));

    let ranked = rankAndScoreWorkers(candidates, userLat, userLng, categorySlug || undefined);

    if (sortBy === 'rating') {
      ranked.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'price_asc') {
      ranked.sort((a, b) => a.startingPrice - b.startingPrice);
    } else if (sortBy === 'distance') {
      ranked.sort((a, b) => a.distanceKm - b.distanceKm);
    }

    return NextResponse.json({
      workers: ranked,
      total: ranked.length,
      category: categorySlug,
    });
  } catch (error: any) {
    console.error('Error fetching workers:', error);
    return NextResponse.json({ error: 'Failed to search workers' }, { status: 500 });
  }
}
