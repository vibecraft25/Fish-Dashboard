import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const [
      totalRecords,
      totalSpecies,
      recordsWithCoordinates,
      uniqueFamilies,
      uniqueCountries,
    ] = await Promise.all([
      prisma.species.count(),
      prisma.species.findMany({
        select: { scientificName: true },
        distinct: ['scientificName'],
      }).then(res => res.length),
      prisma.species.count({
        where: {
          AND: [
            { decimalLatitude: { not: null } },
            { decimalLongitude: { not: null } },
          ],
        },
      }),
      prisma.species.findMany({
        where: { family: { not: null } },
        select: { family: true },
        distinct: ['family'],
      }).then(res => res.length),
      prisma.species.findMany({
        where: { countryCode: { not: null } },
        select: { countryCode: true },
        distinct: ['countryCode'],
      }).then(res => res.length),
    ]);

    return NextResponse.json({
      totalRecords,
      totalSpecies,
      recordsWithCoordinates,
      uniqueFamilies,
      uniqueCountries,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}