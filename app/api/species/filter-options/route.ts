import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const [families, genera, countries] = await Promise.all([
      prisma.species.findMany({
        where: { family: { not: null } },
        select: { family: true },
        distinct: ['family'],
        orderBy: { family: 'asc' },
      }),
      prisma.species.findMany({
        where: { genus: { not: null } },
        select: { genus: true },
        distinct: ['genus'],
        orderBy: { genus: 'asc' },
      }),
      prisma.species.findMany({
        where: { countryCode: { not: null } },
        select: { countryCode: true },
        distinct: ['countryCode'],
        orderBy: { countryCode: 'asc' },
      }),
    ]);

    return NextResponse.json({
      families: families.map(f => f.family).filter(Boolean),
      genera: genera.map(g => g.genus).filter(Boolean),
      countries: countries.map(c => c.countryCode).filter(Boolean),
    });
  } catch (error) {
    console.error('Error fetching filter options:', error);
    return NextResponse.json(
      { error: 'Failed to fetch filter options' },
      { status: 500 }
    );
  }
}