import { NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

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

    // Verify service request
    const request = await prisma.serviceRequest.findUnique({
      where: { id: serviceRequestId },
      include: { review: true, customer: true, worker: true },
    });

    if (!request) {
      return NextResponse.json({ error: 'Service request not found.' }, { status: 404 });
    }

    if (request.customerId !== session.userId) {
      return NextResponse.json({ error: 'You can only review services you requested.' }, { status: 403 });
    }

    if (request.status !== 'COMPLETED') {
      return NextResponse.json({ error: 'Reviews can only be submitted after job completion.' }, { status: 400 });
    }

    if (request.review) {
      return NextResponse.json({ error: 'You have already submitted a review for this job.' }, { status: 400 });
    }

    // Save review & recalculate worker average rating
    const review = await prisma.$transaction(async (tx) => {
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

      // Recalculate average
      const allWorkerReviews = await tx.review.findMany({
        where: { workerId: request.workerId },
        select: { ratingOverall: true },
      });

      const totalRating = allWorkerReviews.reduce((sum, r) => sum + r.ratingOverall, 0);
      const newAverage = Math.round((totalRating / allWorkerReviews.length) * 10) / 10;

      await tx.workerProfile.updateMany({
        where: { userId: request.workerId },
        data: {
          rating: newAverage,
          reviewCount: allWorkerReviews.length,
        },
      });

      return createdReview;
    });

    // Notify the worker
    await prisma.notification.create({
      data: {
        userId: request.workerId,
        title: '⭐ New Rating Received!',
        message: `${request.customer.name} gave you a ${ratingOverall}★ review: "${comment.slice(0, 60)}..."`,
        type: 'REVIEW_NEW',
        link: `/workers/${request.workerId}`,
      },
    });

    return NextResponse.json({
      success: true,
      review,
    });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Review creation error:', error);
    return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 });
  }
}
