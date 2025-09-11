import { MigrationInterface, QueryRunner } from 'typeorm';

export class MigrateToRBAC1734567890000 implements MigrationInterface {
  name = 'MigrateToRBAC1734567890000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create permissions table
    await queryRunner.query(`
      CREATE TABLE "permissions" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "deletedAt" TIMESTAMP,
        "code" character varying(100) NOT NULL,
        "description" text,
        "module" character varying(100),
        CONSTRAINT "UQ_permissions_code" UNIQUE ("code"),
        CONSTRAINT "PK_permissions_id" PRIMARY KEY ("id")
      )
    `);

    // Create roles table
    await queryRunner.query(`
      CREATE TABLE "roles" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "deletedAt" TIMESTAMP,
        "name" character varying(100) NOT NULL,
        "description" text,
        "adminId" uuid NOT NULL,
        CONSTRAINT "UQ_roles_name" UNIQUE ("name"),
        CONSTRAINT "PK_roles_id" PRIMARY KEY ("id")
      )
    `);

    // Create user_roles pivot table
    await queryRunner.query(`
      CREATE TABLE "user_roles" (
        "userId" uuid NOT NULL,
        "roleId" uuid NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_user_roles" PRIMARY KEY ("userId", "roleId")
      )
    `);

    // Create role_permissions pivot table
    await queryRunner.query(`
      CREATE TABLE "role_permissions" (
        "roleId" uuid NOT NULL,
        "permissionId" uuid NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_role_permissions" PRIMARY KEY ("roleId", "permissionId")
      )
    `);

    // Add foreign key constraints
    await queryRunner.query(`
      ALTER TABLE "user_roles" 
      ADD CONSTRAINT "FK_user_roles_userId" 
      FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "user_roles" 
      ADD CONSTRAINT "FK_user_roles_roleId" 
      FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "role_permissions" 
      ADD CONSTRAINT "FK_role_permissions_roleId" 
      FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "role_permissions" 
      ADD CONSTRAINT "FK_role_permissions_permissionId" 
      FOREIGN KEY ("permissionId") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE
    `);

    // Add indexes
    await queryRunner.query(
      `CREATE INDEX "IDX_permissions_code" ON "permissions" ("code")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_roles_name" ON "roles" ("name")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_user_roles_userId" ON "user_roles" ("userId")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_user_roles_roleId" ON "user_roles" ("roleId")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_role_permissions_roleId" ON "role_permissions" ("roleId")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_role_permissions_permissionId" ON "role_permissions" ("permissionId")`,
    );

    // Add profile fields to users table (moved from profile entities)
    await queryRunner.query(`ALTER TABLE "users" ADD "notes" text`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD "documentType" character varying(50)`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "documentNumber" character varying(50)`,
    );
    await queryRunner.query(`ALTER TABLE "users" ADD "birthDate" date`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD "emergencyContact" character varying(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "emergencyPhone" character varying(50)`,
    );

    // Remove roles column from users table (replaced by user_roles table)
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "roles"`);

    // Drop profile tables
    await queryRunner.query(`DROP TABLE IF EXISTS "owner_profiles"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "tenant_profiles"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "staff_profiles"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Recreate profile tables
    await queryRunner.query(`
      CREATE TABLE "owner_profiles" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "deletedAt" TIMESTAMP,
        "userId" uuid NOT NULL,
        "notes" text,
        "documentType" character varying(50),
        "documentNumber" character varying(50),
        "birthDate" date,
        "emergencyContact" character varying(255),
        "emergencyPhone" character varying(50),
        CONSTRAINT "UQ_owner_profiles_userId" UNIQUE ("userId"),
        CONSTRAINT "PK_owner_profiles_id" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "tenant_profiles" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "deletedAt" TIMESTAMP,
        "userId" uuid NOT NULL,
        "notes" text,
        "documentType" character varying(50),
        "documentNumber" character varying(50),
        "birthDate" date,
        "emergencyContact" character varying(255),
        "emergencyPhone" character varying(50),
        "leaseStartDate" date,
        "leaseEndDate" date,
        "monthlyRent" numeric(10,2),
        "currency" character varying(10) NOT NULL DEFAULT 'ARS',
        CONSTRAINT "UQ_tenant_profiles_userId" UNIQUE ("userId"),
        CONSTRAINT "PK_tenant_profiles_id" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "staff_profiles" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "deletedAt" TIMESTAMP,
        "userId" uuid NOT NULL,
        "position" character varying(100) NOT NULL,
        "documentId" character varying(50),
        "hireDate" date,
        "salary" numeric(10,2),
        "currency" character varying(10) NOT NULL DEFAULT 'ARS',
        "notes" text,
        "isActive" boolean NOT NULL DEFAULT true,
        CONSTRAINT "UQ_staff_profiles_userId" UNIQUE ("userId"),
        CONSTRAINT "PK_staff_profiles_id" PRIMARY KEY ("id")
      )
    `);

    // Add back roles column to users
    await queryRunner.query(`
      ALTER TABLE "users" ADD "roles" text[] NOT NULL DEFAULT '{READONLY}'
    `);

    // Remove profile fields from users table
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "notes"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "documentType"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "documentNumber"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "birthDate"`);
    await queryRunner.query(
      `ALTER TABLE "users" DROP COLUMN "emergencyContact"`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "emergencyPhone"`);

    // Drop RBAC tables
    await queryRunner.query(`DROP TABLE "role_permissions"`);
    await queryRunner.query(`DROP TABLE "user_roles"`);
    await queryRunner.query(`DROP TABLE "roles"`);
    await queryRunner.query(`DROP TABLE "permissions"`);
  }
}
