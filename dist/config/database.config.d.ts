import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
export declare const getDatabaseConfig: (configService: ConfigService) => TypeOrmModuleOptions;
declare const _default: DataSource;
export default _default;
