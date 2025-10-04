import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateDecimalPrecision1728003159000 implements MigrationInterface {
  name = 'UpdateDecimalPrecision1728003159000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Update expense_items table
    await queryRunner.query(`
      ALTER TABLE "expense_items" 
      ALTER COLUMN "amount" TYPE DECIMAL(15,2)
    `);

    await queryRunner.query(`
      ALTER TABLE "expense_items" 
      ALTER COLUMN "unitPrice" TYPE DECIMAL(15,2)
    `);

    // Update expenses table
    await queryRunner.query(`
      ALTER TABLE "expenses" 
      ALTER COLUMN "totalAmount" TYPE DECIMAL(15,2)
    `);

    // Update expense_distributions table
    await queryRunner.query(`
      ALTER TABLE "expense_distributions" 
      ALTER COLUMN "amount" TYPE DECIMAL(15,2)
    `);

    await queryRunner.query(`
      ALTER TABLE "expense_distributions" 
      ALTER COLUMN "paidAmount" TYPE DECIMAL(15,2)
    `);

    await queryRunner.query(`
      ALTER TABLE "expense_distributions" 
      ALTER COLUMN "remainingAmount" TYPE DECIMAL(15,2)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revert expense_items table
    await queryRunner.query(`
      ALTER TABLE "expense_items" 
      ALTER COLUMN "amount" TYPE DECIMAL(10,2)
    `);

    await queryRunner.query(`
      ALTER TABLE "expense_items" 
      ALTER COLUMN "unitPrice" TYPE DECIMAL(10,2)
    `);

    // Revert expenses table
    await queryRunner.query(`
      ALTER TABLE "expenses" 
      ALTER COLUMN "totalAmount" TYPE DECIMAL(12,2)
    `);

    // Revert expense_distributions table
    await queryRunner.query(`
      ALTER TABLE "expense_distributions" 
      ALTER COLUMN "amount" TYPE DECIMAL(10,2)
    `);

    await queryRunner.query(`
      ALTER TABLE "expense_distributions" 
      ALTER COLUMN "paidAmount" TYPE DECIMAL(10,2)
    `);

    await queryRunner.query(`
      ALTER TABLE "expense_distributions" 
      ALTER COLUMN "remainingAmount" TYPE DECIMAL(10,2)
    `);
  }
}
