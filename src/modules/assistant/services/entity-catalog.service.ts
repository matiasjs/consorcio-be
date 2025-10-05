import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ColumnMetadata } from 'typeorm/metadata/ColumnMetadata';
import { EntityMetadata as TypeOrmEntityMetadata } from 'typeorm/metadata/EntityMetadata';
import { RelationMetadata } from 'typeorm/metadata/RelationMetadata';
import { EntityCatalog, EntityField, EntityMetadata } from '../interfaces/entity-catalog.interface';

@Injectable()
export class EntityCatalogService {
  constructor(private dataSource: DataSource) { }

  async generateCatalog(): Promise<EntityCatalog> {
    const entities = this.dataSource.entityMetadatas;
    const catalog: EntityCatalog = {
      entities: [],
      relationships: [],
      enums: {},
      generatedAt: new Date().toISOString(),
      version: '1.0.0',
    };

    // Process each entity
    for (const entity of entities) {
      const entityMetadata = this.processEntity(entity);
      catalog.entities.push(entityMetadata);

      // Extract relationships
      for (const relation of entity.relations) {
        catalog.relationships.push({
          from: entity.name,
          to: relation.inverseEntityMetadata.name,
          type: relation.relationType,
          field: relation.propertyName,
        });
      }
    }

    // Extract enums from columns
    for (const entity of entities) {
      for (const column of entity.columns) {
        if (column.enum) {
          const enumName = `${entity.name}.${column.propertyName}`;
          catalog.enums[enumName] = column.enum.map(String);
        }
      }
    }

    return catalog;
  }

  private processEntity(entity: TypeOrmEntityMetadata): EntityMetadata {
    const fields: EntityField[] = [];

    // Process columns
    for (const column of entity.columns) {
      fields.push(this.processColumn(column));
    }

    // Process relations
    for (const relation of entity.relations) {
      fields.push(this.processRelation(relation));
    }

    return {
      name: entity.name,
      tableName: entity.tableName,
      description: this.getEntityDescription(entity.name),
      fields,
      primaryKey: entity.primaryColumns[0]?.propertyName || 'id',
      indexes: entity.indices.map(index => index.name),
      permissions: this.getEntityPermissions(entity.name),
    };
  }

  private processColumn(column: ColumnMetadata): EntityField {
    const field: EntityField = {
      name: column.propertyName,
      type: this.mapColumnType(column),
      required: !column.isNullable && !column.isGenerated,
      nullable: column.isNullable,
      description: this.getFieldDescription(column.propertyName),
    };

    // Add enum values if applicable
    if (column.enum) {
      field.enum = column.enum.map(String);
    }

    // Add validation constraints
    if (column.length || column.precision || column.scale) {
      field.validation = {};
      if (column.length) {
        field.validation.maxLength = Number(column.length);
      }
    }

    return field;
  }

  private processRelation(relation: RelationMetadata): EntityField {
    return {
      name: relation.propertyName,
      type: relation.isOneToMany || relation.isManyToMany ? 'array' : 'object',
      required: !relation.isNullable,
      nullable: relation.isNullable,
      description: this.getFieldDescription(relation.propertyName),
      relation: {
        type: relation.relationType as any,
        target: relation.inverseEntityMetadata.name,
        joinColumn: relation.joinColumns?.[0]?.databaseName,
        inverseField: relation.inverseRelation?.propertyName,
      },
    };
  }

  private mapColumnType(column: ColumnMetadata): string {
    const type = column.type.toString().toLowerCase();

    switch (type) {
      case 'varchar':
      case 'text':
      case 'char':
        return 'string';
      case 'int':
      case 'integer':
      case 'bigint':
      case 'smallint':
        return 'number';
      case 'decimal':
      case 'numeric':
      case 'float':
      case 'double':
        return 'number';
      case 'boolean':
      case 'bool':
        return 'boolean';
      case 'date':
      case 'datetime':
      case 'timestamp':
        return 'date';
      case 'uuid':
        return 'uuid';
      case 'json':
      case 'jsonb':
        return 'object';
      case 'enum':
        return 'enum';
      default:
        return 'string';
    }
  }

  private getEntityDescription(entityName: string): string {
    const descriptions: Record<string, string> = {
      User: 'Sistema de usuarios del consorcio con roles y permisos',
      Building: 'Edificios administrados por el consorcio',
      Unit: 'Unidades funcionales dentro de los edificios',
      Ticket: 'Tickets de soporte y mantenimiento',
      WorkOrder: 'Órdenes de trabajo para mantenimiento',
      Vendor: 'Proveedores de servicios',
      Invoice: 'Facturas de proveedores',
      Payment: 'Pagos realizados',
      Meeting: 'Reuniones de consorcio',
      Document: 'Documentos del consorcio',
      Inspection: 'Inspecciones de edificios',
      Asset: 'Activos del consorcio',
      // Add more descriptions as needed
    };

    return descriptions[entityName] || `Entidad ${entityName} del sistema`;
  }

  private getFieldDescription(fieldName: string): string {
    const descriptions: Record<string, string> = {
      id: 'Identificador único',
      email: 'Dirección de correo electrónico',
      name: 'Nombre',
      fullName: 'Nombre completo',
      phone: 'Número de teléfono',
      address: 'Dirección',
      status: 'Estado del registro',
      createdAt: 'Fecha de creación',
      updatedAt: 'Fecha de última actualización',
      deletedAt: 'Fecha de eliminación (soft delete)',
      // Add more descriptions as needed
    };

    return descriptions[fieldName];
  }

  private getEntityPermissions(entityName: string): any {
    // This would typically come from your RBAC system
    // For now, return basic permissions structure
    return {
      create: ['ADMIN', 'SUPERADMIN'],
      read: ['USER', 'ADMIN', 'SUPERADMIN'],
      update: ['ADMIN', 'SUPERADMIN'],
      delete: ['SUPERADMIN'],
    };
  }
}
