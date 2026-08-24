import { NextResponse } from 'next/server';
import { diagnoseServiceProblem } from '@/lib/ai-assistant';
import prisma from '@/lib/prisma';
import { rankAndScoreWorkers } from '@/lib/matching';

export async function POST(req: Request) {
  try {
    const { query } = await req.json();
    if (!query || typeof query !== 'string') {
      return NextResponse.json({ error: 'Query string is required' }, { status: 400 });
    }

    const diagnosis = diagnoseServiceProblem(query);

    // Look up real matching workers from database
    const matchingCategory = await prisma.serviceCategory.findFirst({
      where: {
        OR: [
          { slug: diagnosis.categorySlug },
          { name: { contains: diagnosis.categoryName } },
        ],
      },
    });

    const categoryId = matchingCategory ? matchingCategory.id : undefined;

    const workers = await prisma.workerProfile.findMany({
      where: {
        ...(categoryId ? { primaryCategoryId: categoryId } : {}),
        user: { isActive: true },
      },
      include: {
        user: true,
        primaryCategory: true,
      },
      take: 6,
    });

    const candidateWorkers = workers.map((w) => ({
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

    const rankedWorkers = rankAndScoreWorkers(candidateWorkers);

    return NextResponse.json({
      diagnosis,
      category: matchingCategory,
      matchedWorkers: rankedWorkers,
    });
  } catch (error: any) {
    console.error('AI diagnose error:', error);
    return NextResponse.json({ error: 'Failed to diagnose problem' }, { status: 500 });
  }
}
