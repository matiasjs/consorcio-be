import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BusinessExceptionFilter } from './common/filters/business-exception.filter';
import { JwtAuthGuard, PermissionsGuard, TenantGuard } from './common/guards';
import appConfig from './config/app.config';
import { getDatabaseConfig } from './config/database.config';
import jwtConfig from './config/jwt.config';
import redisConfig from './config/redis.config';
import { AdministrationsModule } from './modules/administrations/administrations.module';
import { AssetsModule } from './modules/assets/assets.module';
import { AuditLogsModule } from './modules/audit-logs/audit-logs.module';
import { AuthModule } from './modules/auth/auth.module';
import { BuildingsModule } from './modules/buildings/buildings.module';
import { DocumentsModule } from './modules/documents/documents.module';
import { ExpensesModule } from './modules/expenses/expenses.module';
import { HealthModule } from './modules/health/health.module';
import { InspectionsModule } from './modules/inspections/inspections.module';
import { InvoicesModule } from './modules/invoices/invoices.module';
import { MaterialsModule } from './modules/materials/materials.module';
import { MeetingsModule } from './modules/meetings/meetings.module';
import { MessagesModule } from './modules/messages/messages.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { PlansModule } from './modules/plans/plans.module';
import { ResolutionsModule } from './modules/resolutions/resolutions.module';
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';
import { TicketsModule } from './modules/tickets/tickets.module';
import { UnitsModule } from './modules/units/units.module';
import { UsageMetricsModule } from './modules/usage-metrics/usage-metrics.module';
import { UsersModule } from './modules/users/users.module';
import { VendorsModule } from './modules/vendors/vendors.module';
import { WorkOrdersModule } from './modules/workorders/workorders.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, jwtConfig, redisConfig, assistantConfig],
      envFilePath: ['.env.local', '.env'],
    }),

    // Database
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getDatabaseConfig,
      inject: [ConfigService],
    }),

    // Rate limiting
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => [
        {
          ttl: configService.get<number>('THROTTLE_TTL', 60) * 1000,
          limit: configService.get<number>('THROTTLE_LIMIT', 100),
        },
      ],
      inject: [ConfigService],
    }),

    // Feature modules
    AuthModule,
    HealthModule,
    AdministrationsModule,
    TicketsModule,
    MessagesModule,
    UsersModule,
    BuildingsModule,
    UnitsModule,
    VendorsModule,
    InspectionsModule,
    WorkOrdersModule,
    MaterialsModule,
    InvoicesModule,
    PaymentsModule,
    ExpensesModule,
    AssetsModule,
    MeetingsModule,
    DocumentsModule,
    ResolutionsModule,
    PlansModule,
    NotificationsModule,
    SubscriptionsModule,
    UsageMetricsModule,
    AuditLogsModule,
    AssistantModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
    {
      provide: APP_GUARD,
      useClass: TenantGuard,
    },
    {
      provide: APP_FILTER,
      useClass: BusinessExceptionFilter,
    },
  ],
})
export class AppModule { }
