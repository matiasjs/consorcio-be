"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdministrationsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const decorators_1 = require("../../common/decorators");
const dto_1 = require("../../common/dto");
const enums_1 = require("../../common/enums");
const guards_1 = require("../../common/guards");
const administrations_service_1 = require("./administrations.service");
const dto_2 = require("./dto");
let AdministrationsController = class AdministrationsController {
    administrationsService;
    constructor(administrationsService) {
        this.administrationsService = administrationsService;
    }
    create(createAdministrationDto) {
        return this.administrationsService.create(createAdministrationDto);
    }
    findAll(paginationDto) {
        return this.administrationsService.findAll(paginationDto);
    }
    findOne(id) {
        return this.administrationsService.findOne(id);
    }
    update(id, updateAdministrationDto) {
        return this.administrationsService.update(id, updateAdministrationDto);
    }
    remove(id) {
        return this.administrationsService.remove(id);
    }
};
exports.AdministrationsController = AdministrationsController;
__decorate([
    (0, common_1.Post)(),
    (0, decorators_1.Roles)(enums_1.UserRole.SUPERADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new administration' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Administration created successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 409,
        description: 'Administration with CUIT or email already exists',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_2.CreateAdministrationDto]),
    __metadata("design:returntype", void 0)
], AdministrationsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, decorators_1.Roles)(enums_1.UserRole.SUPERADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Get all administrations' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Administrations retrieved successfully',
    }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.PaginationDto]),
    __metadata("design:returntype", void 0)
], AdministrationsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, decorators_1.Roles)(enums_1.UserRole.SUPERADMIN, enums_1.UserRole.ADMIN_OWNER),
    (0, swagger_1.ApiOperation)({ summary: 'Get administration by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Administration ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Administration retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Administration not found',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdministrationsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, decorators_1.Roles)(enums_1.UserRole.SUPERADMIN, enums_1.UserRole.ADMIN_OWNER),
    (0, swagger_1.ApiOperation)({ summary: 'Update administration' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Administration ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Administration updated successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Administration not found',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_2.UpdateAdministrationDto]),
    __metadata("design:returntype", void 0)
], AdministrationsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, decorators_1.Roles)(enums_1.UserRole.SUPERADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Delete administration' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Administration ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Administration deleted successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Administration not found',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdministrationsController.prototype, "remove", null);
exports.AdministrationsController = AdministrationsController = __decorate([
    (0, swagger_1.ApiTags)('Administrations'),
    (0, common_1.Controller)({ path: 'administrations', version: '1' }),
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard, guards_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [administrations_service_1.AdministrationsService])
], AdministrationsController);
//# sourceMappingURL=administrations.controller.js.map