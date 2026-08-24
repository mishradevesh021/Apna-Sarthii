import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const categories = await prisma.serviceCategory.findMany({
      include: {
        _count: {
          select: { workers: true },
        },
      },
      orderBy: { activeWorkersCount: 'desc' },
    });

    const formatted = categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      iconName: cat.iconName,
      colorScheme: cat.colorScheme,
      startingPrice: cat.startingPrice,
      activeWorkersCount: Math.max(cat.activeWorkersCount, cat._count.workers),
    }));

    return NextResponse.json({ categories: formatted });
  } catch (error: any) {
    console.error('Error fetching services:', error);
    return NextResponse.json({ error: 'Failed to load categories' }, { status: 500 });
  }
}
