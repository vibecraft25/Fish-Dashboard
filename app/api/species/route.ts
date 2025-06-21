import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const family = searchParams.get('family') || undefined;
    const genus = searchParams.get('genus') || undefined;
    const country = searchParams.get('country') || undefined;
    const yearFrom = searchParams.get('yearFrom') ? parseInt(searchParams.get('yearFrom')!) : undefined;
    const yearTo = searchParams.get('yearTo') ? parseInt(searchParams.get('yearTo')!) : undefined;

    const where: any = {};
    
    if (family) where.family = family;
    if (genus) where.genus = genus;
    if (country) where.countryCode = country;
    
    if (yearFrom || yearTo) {
      where.year = {};
      if (yearFrom) where.year.gte = yearFrom;
      if (yearTo) where.year.lte = yearTo;
    }

    const [species, total] = await Promise.all([
      prisma.species.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { scientificName: 'asc' },
        select: {
          id: true,
          scientificName: true,
          family: true,
          genus: true,
          species: true,
          countryCode: true,
          locality: true,
          year: true,
          decimalLatitude: true,
          decimalLongitude: true,
          institutionCode: true,
          catalogNumber: true,
        },
      }),
      prisma.species.count({ where }),
    ]);

    return NextResponse.json({ species, total });
  } catch (error) {
    console.error('Error fetching species:', error);
    return NextResponse.json(
      { error: 'Failed to fetch species data' },
      { status: 500 }
    );
  }
}