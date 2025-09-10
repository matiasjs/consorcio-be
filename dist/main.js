"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
    }));
    app.enableVersioning({
        type: common_1.VersioningType.URI,
        defaultVersion: configService.get('app.apiVersion', 'v1'),
    });
    app.setGlobalPrefix(configService.get('app.apiPrefix', 'api'));
    app.enableCors({
        origin: configService.get('app.corsOrigin', ['http://localhost:3000']),
        credentials: true,
    });
    if (configService.get('app.nodeEnv') !== 'production') {
        const config = new swagger_1.DocumentBuilder()
            .setTitle('Consorcios Backend API')
            .setDescription('API REST para gestión de consorcios/edificios')
            .setVersion('1.0')
            .addBearerAuth()
            .build();
        const document = swagger_1.SwaggerModule.createDocument(app, config);
        swagger_1.SwaggerModule.setup('api/docs', app, document, {
            swaggerOptions: {
                persistAuthorization: true,
            },
        });
    }
    const port = configService.get('app.port', 3000);
    await app.listen(port);
    console.log(`🚀 Application is running on: http://localhost:${port}`);
    console.log(`📚 Swagger documentation: http://localhost:${port}/api/docs`);
}
bootstrap();
//# sourceMappingURL=main.js.map