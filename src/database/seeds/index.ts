import { DataSource } from 'typeorm';
import { seedRBAC } from './rbac.seed';

export async function runSeeds(dataSource: DataSource): Promise<void> {
  console.log('🌱 Starting database seeding...');
  
  try {
    await seedRBAC(dataSource);
    console.log('✅ All seeds completed successfully!');
  } catch (error) {
    console.error('❌ Error running seeds:', error);
    throw error;
  }
}
