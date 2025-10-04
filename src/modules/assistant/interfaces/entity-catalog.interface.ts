export interface EntityField {
  name: string;
  type: string;
  required: boolean;
  nullable: boolean;
  description?: string;
  enum?: string[];
  validation?: {
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    pattern?: string;
  };
  relation?: {
    type: 'one-to-one' | 'one-to-many' | 'many-to-one' | 'many-to-many';
    target: string;
    joinColumn?: string;
    inverseField?: string;
  };
}

export interface EntityMetadata {
  name: string;
  tableName: string;
  description?: string;
  fields: EntityField[];
  primaryKey: string;
  indexes?: string[];
  permissions?: {
    create: string[];
    read: string[];
    update: string[];
    delete: string[];
  };
}

export interface EntityCatalog {
  entities: EntityMetadata[];
  relationships: {
    from: string;
    to: string;
    type: string;
    field: string;
  }[];
  enums: {
    [key: string]: string[];
  };
  generatedAt: string;
  version: string;
}
