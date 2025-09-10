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
exports.UnitsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const user_role_enum_1 = require("../../common/enums/user-role.enum");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const tenant_guard_1 = require("../../common/guards/tenant.guard");
const user_entity_1 = require("../../entities/user.entity");
const dto_1 = require("./dto");
const units_service_1 = require("./units.service");
let UnitsController = class UnitsController {
    unitsService;
    constructor(unitsService) {
        this.unitsService = unitsService;
    }
    create(createUnitDto, currentUser) {
        return this.unitsService.create(createUnitDto, currentUser.adminId);
    }
    findAll(currentUser) {
        return this.unitsService.findAll(currentUser.adminId);
    }
    findOne(id, currentUser) {
        return this.unitsService.findOne(id, currentUser.adminId);
    }
    update(id, updateUnitDto, currentUser) {
        return this.unitsService.update(id, updateUnitDto, currentUser.adminId);
    }
    remove(id, currentUser) {
        return this.unitsService.remove(id, currentUser.adminId);
    }
    createOccupancy(id, createOccupancyDto, currentUser) {
        return this.unitsService.createOccupancy(id, createOccupancyDto, currentUser.adminId);
    }
    getOccupancy(id, currentUser) {
        return this.unitsService.getOccupancy(id, currentUser.adminId);
    }
};
exports.UnitsController = UnitsController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.SUPERADMIN, user_role_enum_1.UserRole.ADMIN_OWNER),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new unit' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Unit created successfully' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateUnitDto,
        user_entity_1.User]),
    __metadata("design:returntype", void 0)
], UnitsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.SUPERADMIN, user_role_enum_1.UserRole.ADMIN_OWNER, user_role_enum_1.UserRole.STAFF),
    (0, swagger_1.ApiOperation)({ summary: 'Get all units' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Units retrieved successfully' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", void 0)
], UnitsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.SUPERADMIN, user_role_enum_1.UserRole.ADMIN_OWNER, user_role_enum_1.UserRole.STAFF),
    (0, swagger_1.ApiOperation)({ summary: 'Get unit by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Unit retrieved successfully' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_1.User]),
    __metadata("design:returntype", void 0)
], UnitsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.SUPERADMIN, user_role_enum_1.UserRole.ADMIN_OWNER),
    (0, swagger_1.ApiOperation)({ summary: 'Update unit' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Unit updated successfully' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.UpdateUnitDto,
        user_entity_1.User]),
    __metadata("design:returntype", void 0)
], UnitsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.SUPERADMIN, user_role_enum_1.UserRole.ADMIN_OWNER),
    (0, swagger_1.ApiOperation)({ summary: 'Delete unit' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Unit deleted successfully' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_1.User]),
    __metadata("design:returntype", void 0)
], UnitsController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/occupancy'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.SUPERADMIN, user_role_enum_1.UserRole.ADMIN_OWNER),
    (0, swagger_1.ApiOperation)({ summary: 'Create unit occupancy' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Unit occupancy created successfully' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.CreateUnitOccupancyDto,
        user_entity_1.User]),
    __metadata("design:returntype", void 0)
], UnitsController.prototype, "createOccupancy", null);
__decorate([
    (0, common_1.Get)(':id/occupancy'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.SUPERADMIN, user_role_enum_1.UserRole.ADMIN_OWNER, user_role_enum_1.UserRole.STAFF),
    (0, swagger_1.ApiOperation)({ summary: 'Get unit occupancy' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Unit occupancy retrieved successfully' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_1.User]),
    __metadata("design:returntype", void 0)
], UnitsController.prototype, "getOccupancy", null);
exports.UnitsController = UnitsController = __decorate([
    (0, swagger_1.ApiTags)('units'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, tenant_guard_1.TenantGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)({ path: 'units', version: '1' }),
    __metadata("design:paramtypes", [units_service_1.UnitsService])
], UnitsController);
//# sourceMappingURL=units.controller.js.map