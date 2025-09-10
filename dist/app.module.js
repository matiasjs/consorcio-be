"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const throttler_1 = require("@nestjs/throttler");
const typeorm_1 = require("@nestjs/typeorm");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const guards_1 = require("./common/guards");
const app_config_1 = __importDefault(require("./config/app.config"));
const database_config_1 = require("./config/database.config");
const jwt_config_1 = __importDefault(require("./config/jwt.config"));
const redis_config_1 = __importDefault(require("./config/redis.config"));
const administrations_module_1 = require("./modules/administrations/administrations.module");
const assets_module_1 = require("./modules/assets/assets.module");
const audit_logs_module_1 = require("./modules/audit-logs/audit-logs.module");
const auth_module_1 = require("./modules/auth/auth.module");
const buildings_module_1 = require("./modules/buildings/buildings.module");
const documents_module_1 = require("./modules/documents/documents.module");
const inspections_module_1 = require("./modules/inspections/inspections.module");
const invoices_module_1 = require("./modules/invoices/invoices.module");
const materials_module_1 = require("./modules/materials/materials.module");
const meetings_module_1 = require("./modules/meetings/meetings.module");
const messages_module_1 = require("./modules/messages/messages.module");
const notifications_module_1 = require("./modules/notifications/notifications.module");
const payments_module_1 = require("./modules/payments/payments.module");
const plans_module_1 = require("./modules/plans/plans.module");
const resolutions_module_1 = require("./modules/resolutions/resolutions.module");
const subscriptions_module_1 = require("./modules/subscriptions/subscriptions.module");
const tickets_module_1 = require("./modules/tickets/tickets.module");
const units_module_1 = require("./modules/units/units.module");
const usage_metrics_module_1 = require("./modules/usage-metrics/usage-metrics.module");
const users_module_1 = require("./modules/users/users.module");
const vendors_module_1 = require("./modules/vendors/vendors.module");
const workorders_module_1 = require("./modules/workorders/workorders.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                load: [app_config_1.default, jwt_config_1.default, redis_config_1.default],
                envFilePath: ['.env.local', '.env'],
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: database_config_1.getDatabaseConfig,
                inject: [config_1.ConfigService],
            }),
            throttler_1.ThrottlerModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => [
                    {
                        ttl: configService.get('THROTTLE_TTL', 60) * 1000,
                        limit: configService.get('THROTTLE_LIMIT', 100),
                    },
                ],
                inject: [config_1.ConfigService],
            }),
            auth_module_1.AuthModule,
            administrations_module_1.AdministrationsModule,
            tickets_module_1.TicketsModule,
            messages_module_1.MessagesModule,
            users_module_1.UsersModule,
            buildings_module_1.BuildingsModule,
            units_module_1.UnitsModule,
            vendors_module_1.VendorsModule,
            inspections_module_1.InspectionsModule,
            workorders_module_1.WorkOrdersModule,
            materials_module_1.MaterialsModule,
            invoices_module_1.InvoicesModule,
            payments_module_1.PaymentsModule,
            assets_module_1.AssetsModule,
            meetings_module_1.MeetingsModule,
            documents_module_1.DocumentsModule,
            resolutions_module_1.ResolutionsModule,
            plans_module_1.PlansModule,
            notifications_module_1.NotificationsModule,
            subscriptions_module_1.SubscriptionsModule,
            usage_metrics_module_1.UsageMetricsModule,
            audit_logs_module_1.AuditLogsModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            app_service_1.AppService,
            {
                provide: core_1.APP_GUARD,
                useClass: guards_1.JwtAuthGuard,
            },
            {
                provide: core_1.APP_GUARD,
                useClass: guards_1.RolesGuard,
            },
            {
                provide: core_1.APP_GUARD,
                useClass: guards_1.TenantGuard,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map