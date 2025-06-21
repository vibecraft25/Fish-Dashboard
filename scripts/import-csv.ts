import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import csv from 'csv-parser';
import path from 'path';

const prisma = new PrismaClient();

interface CsvRow {
  gbifID: string;
  datasetKey: string;
  occurrenceID: string;
  kingdom: string;
  phylum: string;
  class: string;
  order: string;
  family: string;
  genus: string;
  species: string;
  infraspecificEpithet: string;
  taxonRank: string;
  scientificName: string;
  verbatimScientificName: string;
  verbatimScientificNameAuthorship: string;
  countryCode: string;
  locality: string;
  stateProvince: string;
  occurrenceStatus: string;
  individualCount: string;
  publishingOrgKey: string;
  decimalLatitude: string;
  decimalLongitude: string;
  coordinateUncertaintyInMeters: string;
  coordinatePrecision: string;
  elevation: string;
  elevationAccuracy: string;
  depth: string;
  depthAccuracy: string;
  eventDate: string;
  day: string;
  month: string;
  year: string;
  taxonKey: string;
  speciesKey: string;
  basisOfRecord: string;
  institutionCode: string;
  collectionCode: string;
  catalogNumber: string;
  recordNumber: string;
  identifiedBy: string;
  dateIdentified: string;
  license: string;
  rightsHolder: string;
  recordedBy: string;
  typeStatus: string;
  establishmentMeans: string;
  lastInterpreted: string;
  mediaType: string;
  issue: string;
}

async function importData() {
  console.log('🐟 Starting FishBase data import...');
  
  const csvPath = path.join(process.cwd(), 'fishbasedatabase.csv');
  
  if (!fs.existsSync(csvPath)) {
    console.error('❌ CSV file not found at:', csvPath);
    process.exit(1);
  }

  let totalRecords = 0;
  let importedRecords = 0;
  let skippedRecords = 0;
  const errors: string[] = [];

  const records: any[] = [];

  // Read and parse CSV
  await new Promise((resolve, reject) => {
    fs.createReadStream(csvPath)
      .pipe(csv({ separator: '\t' })) // Tab-separated values
      .on('data', (row: CsvRow) => {
        totalRecords++;
        
        try {
          // Parse numeric values
          const parseFloatValue = (val: string): number | null => {
            if (!val || val.trim() === '') return null;
            const parsed = parseFloat(val);
            return isNaN(parsed) ? null : parsed;
          };

          const parseIntValue = (val: string): number | null => {
            if (!val || val.trim() === '') return null;
            const parsed = parseInt(val, 10);
            return isNaN(parsed) ? null : parsed;
          };

          const parseDate = (val: string): Date | null => {
            if (!val || val === '') return null;
            const date = new Date(val);
            return isNaN(date.getTime()) ? null : date;
          };

          // Validate gbifID
          if (!row.gbifID || row.gbifID.trim() === '') {
            throw new Error('Invalid gbifID');
          }

          // Prepare record
          const record = {
            gbifID: BigInt(row.gbifID),
            datasetKey: row.datasetKey || null,
            occurrenceID: row.occurrenceID || null,
            kingdom: row.kingdom || null,
            phylum: row.phylum || null,
            class: row.class || null,
            order: row.order || null,
            family: row.family || null,
            genus: row.genus || null,
            species: row.species || null,
            infraspecificEpithet: row.infraspecificEpithet || null,
            taxonRank: row.taxonRank || null,
            scientificName: row.scientificName || 'Unknown',
            verbatimScientificName: row.verbatimScientificName || null,
            countryCode: row.countryCode || null,
            locality: row.locality || null,
            stateProvince: row.stateProvince || null,
            occurrenceStatus: row.occurrenceStatus || null,
            individualCount: parseIntValue(row.individualCount),
            decimalLatitude: parseFloatValue(row.decimalLatitude),
            decimalLongitude: parseFloatValue(row.decimalLongitude),
            coordinateUncertaintyInMeters: parseFloatValue(row.coordinateUncertaintyInMeters),
            coordinatePrecision: parseFloatValue(row.coordinatePrecision),
            elevation: parseFloatValue(row.elevation),
            elevationAccuracy: parseFloatValue(row.elevationAccuracy),
            depth: parseFloatValue(row.depth),
            depthAccuracy: parseFloatValue(row.depthAccuracy),
            eventDate: parseDate(row.eventDate),
            day: parseIntValue(row.day),
            month: parseIntValue(row.month),
            year: parseIntValue(row.year),
            taxonKey: row.taxonKey && row.taxonKey.trim() !== '' ? BigInt(row.taxonKey) : null,
            speciesKey: row.speciesKey && row.speciesKey.trim() !== '' ? BigInt(row.speciesKey) : null,
            basisOfRecord: row.basisOfRecord || null,
            institutionCode: row.institutionCode || null,
            collectionCode: row.collectionCode || null,
            catalogNumber: row.catalogNumber || null,
            recordNumber: row.recordNumber || null,
            identifiedBy: row.identifiedBy || null,
            dateIdentified: parseDate(row.dateIdentified),
            license: row.license || null,
            rightsHolder: row.rightsHolder || null,
            recordedBy: row.recordedBy || null,
            typeStatus: row.typeStatus || null,
            establishmentMeans: row.establishmentMeans || null,
            lastInterpreted: parseDate(row.lastInterpreted),
            mediaType: row.mediaType || null,
            issue: row.issue || null,
          };

          records.push(record);
        } catch (error) {
          skippedRecords++;
          const errorMessage = error instanceof Error ? error.message : String(error);
          if (errors.length < 100) { // Limit error messages
            errors.push(`Row ${totalRecords}: ${errorMessage}`);
          }
        }
      })
      .on('end', resolve)
      .on('error', reject);
  });

  console.log(`📊 Total records found: ${totalRecords}`);
  console.log(`📊 Valid records to import: ${records.length}`);
  console.log(`📥 Starting database import...`);

  // Import records in batches
  const batchSize = 50; // Reduced batch size
  for (let i = 0; i < records.length; i += batchSize) {
    const batch = records.slice(i, i + batchSize);
    
    try {
      const result = await prisma.species.createMany({
        data: batch,
        skipDuplicates: true,
      });
      importedRecords += result.count;
      
      if (i % 500 === 0) {
        console.log(`✅ Progress: ${i}/${records.length} records processed...`);
      }
    } catch (error) {
      console.error(`❌ Error importing batch ${i}-${i + batchSize}:`, error);
      if (errors.length < 100) {
        errors.push(`Batch ${i}-${i + batchSize}: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
  }

  // Print summary
  console.log('\n📈 Import Summary:');
  console.log(`✅ Successfully imported: ${importedRecords} records`);
  console.log(`⚠️  Skipped: ${skippedRecords} records`);
  
  if (errors.length > 0) {
    console.log(`\n❌ Errors encountered: ${errors.length}`);
    console.log('First 10 errors:');
    errors.slice(0, 10).forEach(error => console.log(`  - ${error}`));
  }

  // Print some statistics
  const stats = await prisma.species.aggregate({
    _count: true,
    _min: {
      year: true,
      decimalLatitude: true,
      decimalLongitude: true,
    },
    _max: {
      year: true,
      decimalLatitude: true,
      decimalLongitude: true,
    },
  });

  console.log('\n📊 Database Statistics:');
  console.log(`Total records in database: ${stats._count}`);
  console.log(`Year range: ${stats._min.year || 'N/A'} - ${stats._max.year || 'N/A'}`);
  console.log(`Latitude range: ${stats._min.decimalLatitude || 'N/A'} - ${stats._max.decimalLatitude || 'N/A'}`);
  console.log(`Longitude range: ${stats._min.decimalLongitude || 'N/A'} - ${stats._max.decimalLongitude || 'N/A'}`);

  // Count records with coordinates
  const withCoords = await prisma.species.count({
    where: {
      AND: [
        { decimalLatitude: { not: null } },
        { decimalLongitude: { not: null } },
      ],
    },
  });

  console.log(`Records with coordinates: ${withCoords} (${((withCoords / stats._count) * 100).toFixed(2)}%)`);
}

// Run the import
importData()
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });