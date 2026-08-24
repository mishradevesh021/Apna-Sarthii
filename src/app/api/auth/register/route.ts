import { NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { hashPassword, AUTH_COOKIE_NAME } from '@/lib/auth';
import { signJWT } from '@/lib/jwt';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['CUSTOMER', 'WORKER']),
  city: z.string().default('Prayagraj'),
  locality: z.string().default('Civil Lines'),
  // Worker specific fields
  categoryId: z.string().optional(),
  experienceYears: z.number().optional(),
  startingPrice: z.number().optional(),
  bio: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = registerSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 }
      );
    }

    const { name, email, phone, password, role, city, locality, categoryId, experienceYears, startingPrice, bio } = result.data;

    // Check existing
    const existing = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email.toLowerCase() },
          ...(phone ? [{ phone }] : []),
        ],
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'An account with this email or phone already exists.' },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);

    // Create user with nested profile based on role
    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        phone: phone || null,
        passwordHash,
        role,
        city,
        locality,
        ...(role === 'CUSTOMER'
          ? {
              customerProfile: {
                create: {
                  defaultAddress: `${locality}, ${city}`,
                },
              },
            }
          : {
              workerProfile: {
                create: {
                  primaryCategoryId: categoryId || (await prisma.serviceCategory.findFirst())?.id || '',
                  experienceYears: experienceYears || 2,
                  startingPrice: startingPrice || 250,
                  bio: bio || `Professional ${role.toLowerCase()} based in ${locality}, ${city}.`,
                  isAvailable: true,
                  isVerified: false,
                  identityVerified: false,
                  professionVerified: false,
                },
              },
            }),
      },
      include: {
        customerProfile: true,
        workerProfile: true,
      },
    });

    const token = await signJWT({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        city: user.city,
        locality: user.locality,
      },
    });

    response.cookies.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Registration failed. Please try again.' },
      { status: 500 }
    );
  }
}
