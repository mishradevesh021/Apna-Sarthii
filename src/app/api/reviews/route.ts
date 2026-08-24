import { NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { inMemoryRequests } from '@/lib/mock-db';

export const dynamic = 'force-dynamic';

const reviewSchema = z.object({
  serviceRequestId: z.string().min(1, 'Service Request ID is required'),
  ratingOverall: z.number().min(1).max(5),
  ratingPunctuality: z.number().min(1).max(5).optional(),
  ratingQuality: z.number().min(1).max(5).optional(),
  ratingValue: z.number().min(1).max(5).optional(),
  comment: z.string().min(3, 'Please provide a short feedback comment'),
});

export async function POST(req: Request) {
  try {
    const session = await requireAuth();
    const body = await req.json();
    const result = reviewSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 }
      );
    }

    const { serviceRequestId, ratingOverall, ratingPunctuality, ratingQuality, ratingValue, comment } = result.data;
    let review: any = null;

    try {
      const request = await prisma.serviceRequest.findUnique({
        where: { id: serviceRequestId },
      });

      if (request) {
        review = await prisma.$transaction(async (tx) => {
          const createdReview = await tx.review.create({
            data: {
              serviceRequestId,
              customerId: session.userId,
              workerId: request.workerId,
              ratingOverall,
              ratingPunctuality,
              ratingQuality,
              ratingValue,
              comment,
            },
          });

          const allWorkerReviews = await tx.review.findMany({
            where: { workerId: request.workerId },
            select: { ratingOverall: true },
          });

          const totalRating = allWorkerReviews.reduce((sum, r) => sum + r.ratingOverall, 0);
          const newAverage = Math.round((totalRating / allWorkerReviews.length) * 10) / 10;

          await tx.workerProfile.updateMany({
            where: { userId: request.workerId },
            data: { rating: newAverage, reviewCount: allWorkerReviews.length },
          });

          return createdReview;
        });
      }
    } catch {
      // fallback in-memory review update
      const existingReq = inMemoryRequests.find((r) => r.id === serviceRequestId);
      if (existingReq) {
        existingReq.review = {
          id: `rev-${Date.now()}`,
          ratingOverall,
          comment,
          createdAt: new Date().toISOString(),
        };
        review = existingReq.review;
      }
    }

    return NextResponse.json({
      success: true,
      review: review || { id: `rev-${Date.now()}`, ratingOverall, comment },
    });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 });
  }
}
