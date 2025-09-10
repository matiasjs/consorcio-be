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
exports.BuildingsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const user_role_enum_1 = require("../../common/enums/user-role.enum");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const tenant_guard_1 = require("../../common/guards/tenant.guard");
const user_entity_1 = require("../../entities/user.entity");
const buildings_service_1 = require("./buildings.service");
const dto_1 = require("./dto");
let BuildingsController = class BuildingsController {
    buildingsService;
    constructor(buildingsService) {
        this.buildingsService = buildingsService;
    }
    create(createBuildingDto, currentUser) {
        return this.buildingsService.create(createBuildingDto, currentUser.adminId);
    }
    findAll(currentUser) {
        return this.buildingsService.findAll(currentUser.adminId);
    }
    findOne(id, currentUser) {
        return this.buildingsService.findOne(id, currentUser.adminId);
    }
    update(id, updateBuildingDto, currentUser) {
        return this.buildingsService.update(id, updateBuildingDto, currentUser.adminId);
    }
    remove(id, currentUser) {
        return this.buildingsService.remove(id, currentUser.adminId);
    }
};
exports.BuildingsController = BuildingsController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.SUPERADMIN, user_role_enum_1.UserRole.ADMIN_OWNER),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new building' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Building created successfully' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateBuildingDto,
        user_entity_1.User]),
    __metadata("design:returntype", void 0)
], BuildingsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.SUPERADMIN, user_role_enum_1.UserRole.ADMIN_OWNER, user_role_enum_1.UserRole.STAFF),
    (0, swagger_1.ApiOperation)({ summary: 'Get all buildings' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Buildings retrieved successfully' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", void 0)
], BuildingsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.SUPERADMIN, user_role_enum_1.UserRole.ADMIN_OWNER, user_role_enum_1.UserRole.STAFF),
    (0, swagger_1.ApiOperation)({ summary: 'Get building by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Building retrieved successfully' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_1.User]),
    __metadata("design:returntype", void 0)
], BuildingsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.SUPERADMIN, user_role_enum_1.UserRole.ADMIN_OWNER),
    (0, swagger_1.ApiOperation)({ summary: 'Update building' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Building updated successfully' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.UpdateBuildingDto,
        user_entity_1.User]),
    __metadata("design:returntype", void 0)
], BuildingsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.SUPERADMIN, user_role_enum_1.UserRole.ADMIN_OWNER),
    (0, swagger_1.ApiOperation)({ summary: 'Delete building' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Building deleted successfully' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_1.User]),
    __metadata("design:returntype", void 0)
], BuildingsController.prototype, "remove", null);
exports.BuildingsController = BuildingsController = __decorate([
    (0, swagger_1.ApiTags)('buildings'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, tenant_guard_1.TenantGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)({ path: 'buildings', version: '1' }),
    __metadata("design:paramtypes", [buildings_service_1.BuildingsService])
], BuildingsController);
//# sourceMappingURL=buildings.controller.js.map