import { NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { requireAuth, requireRole } from '@/lib/auth';

const createReportSchema = z.object({
  reportedUserId: z.string().min(1),
  reason: z.string().min(2),
  description: z.string().min(5),
});

export async function GET() {
  try {
    await requireRole(['ADMIN']);

    const reports = await prisma.report.findMany({
      include: {
        reporter: { select: { id: true, name: true, email: true, role: true } },
        reportedUser: { select: { id: true, name: true, email: true, role: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ reports });
  } catch (error: any) {
    if (error.message === 'FORBIDDEN' || error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Access Denied' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Failed to fetch reports' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await requireAuth();
    const body = await req.json();
    const result = createReportSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error.errors[0].message }, { status: 400 });
    }

    const { reportedUserId, reason, description } = result.data;

    const report = await prisma.report.create({
      data: {
        reporterId: session.userId,
        reportedUserId,
        reason,
        description,
        status: 'PENDING',
      },
    });

    return NextResponse.json({ success: true, report });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to submit report' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await requireRole(['ADMIN']);
    const { reportId, status } = await req.json();

    const updated = await prisma.report.update({
      where: { id: reportId },
      data: { status },
    });

    return NextResponse.json({ success: true, report: updated });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to update report' }, { status: 500 });
  }
}
