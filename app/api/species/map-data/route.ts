import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const family = searchParams.get('family') || undefined;
    const genus = searchParams.get('genus') || undefined;
    const country = searchParams.get('country') || undefined;
    const yearFrom = searchParams.get('yearFrom') ? parseInt(searchParams.get('yearFrom')!) : undefined;
    const yearTo = searchParams.get('yearTo') ? parseInt(searchParams.get('yearTo')!) : undefined;

    const where: any = {
      decimalLatitude: { not: null },
      decimalLongitude: { not: null },
    };
    
    if (family) where.family = family;
    if (genus) where.genus = genus;
    if (country) where.countryCode = country;
    
    if (yearFrom || yearTo) {
      where.year = {};
      if (yearFrom) where.year.gte = yearFrom;
      if (yearTo) where.year.lte = yearTo;
    }

    const species = await prisma.species.findMany({
      where,
      select: {
        id: true,
        scientificName: true,
        decimalLatitude: true,
        decimalLongitude: true,
        locality: true,
        countryCode: true,
        year: true,
        family: true,
        genus: true,
      },
      take: 5000, // Limit to prevent performance issues
    });

    return NextResponse.json(species);
  } catch (error) {
    console.error('Error fetching map data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch map data' },
      { status: 500 }
    );
  }
}