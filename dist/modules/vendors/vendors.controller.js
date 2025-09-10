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
exports.VendorsController = void 0;
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
const vendors_service_1 = require("./vendors.service");
let VendorsController = class VendorsController {
    vendorsService;
    constructor(vendorsService) {
        this.vendorsService = vendorsService;
    }
    create(createVendorDto, currentUser) {
        return this.vendorsService.create(createVendorDto, currentUser.adminId);
    }
    findAll(currentUser, trade) {
        return this.vendorsService.findAll(currentUser.adminId, trade);
    }
    findOne(id, currentUser) {
        return this.vendorsService.findOne(id, currentUser.adminId);
    }
    update(id, updateVendorDto, currentUser) {
        return this.vendorsService.update(id, updateVendorDto, currentUser.adminId);
    }
    remove(id, currentUser) {
        return this.vendorsService.remove(id, currentUser.adminId);
    }
    createAvailability(id, createAvailabilityDto, currentUser) {
        return this.vendorsService.createAvailability(id, createAvailabilityDto, currentUser.adminId);
    }
    getAvailability(id, currentUser) {
        return this.vendorsService.getAvailabilities(id, currentUser.adminId);
    }
    updateAvailability(id, availabilityId, updateAvailabilityDto, currentUser) {
        return this.vendorsService.updateAvailability(id, availabilityId, updateAvailabilityDto, currentUser.adminId);
    }
    removeAvailability(id, availabilityId, currentUser) {
        return this.vendorsService.removeAvailability(id, availabilityId, currentUser.adminId);
    }
};
exports.VendorsController = VendorsController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.SUPERADMIN, user_role_enum_1.UserRole.ADMIN_OWNER),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new vendor' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Vendor created successfully' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateVendorDto,
        user_entity_1.User]),
    __metadata("design:returntype", void 0)
], VendorsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.SUPERADMIN, user_role_enum_1.UserRole.ADMIN_OWNER, user_role_enum_1.UserRole.STAFF),
    (0, swagger_1.ApiOperation)({ summary: 'Get all vendors' }),
    (0, swagger_1.ApiQuery)({ name: 'trade', required: false, description: 'Filter by trade' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Vendors retrieved successfully' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('trade')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String]),
    __metadata("design:returntype", void 0)
], VendorsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.SUPERADMIN, user_role_enum_1.UserRole.ADMIN_OWNER, user_role_enum_1.UserRole.STAFF),
    (0, swagger_1.ApiOperation)({ summary: 'Get vendor by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Vendor retrieved successfully' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_1.User]),
    __metadata("design:returntype", void 0)
], VendorsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.SUPERADMIN, user_role_enum_1.UserRole.ADMIN_OWNER),
    (0, swagger_1.ApiOperation)({ summary: 'Update vendor' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Vendor updated successfully' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.UpdateVendorDto,
        user_entity_1.User]),
    __metadata("design:returntype", void 0)
], VendorsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.SUPERADMIN, user_role_enum_1.UserRole.ADMIN_OWNER),
    (0, swagger_1.ApiOperation)({ summary: 'Delete vendor' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Vendor deleted successfully' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_1.User]),
    __metadata("design:returntype", void 0)
], VendorsController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/availability'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.SUPERADMIN, user_role_enum_1.UserRole.ADMIN_OWNER),
    (0, swagger_1.ApiOperation)({ summary: 'Create vendor availability' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Vendor availability created successfully' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.CreateVendorAvailabilityDto,
        user_entity_1.User]),
    __metadata("design:returntype", void 0)
], VendorsController.prototype, "createAvailability", null);
__decorate([
    (0, common_1.Get)(':id/availability'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.SUPERADMIN, user_role_enum_1.UserRole.ADMIN_OWNER, user_role_enum_1.UserRole.STAFF),
    (0, swagger_1.ApiOperation)({ summary: 'Get vendor availability' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Vendor availability retrieved successfully' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_1.User]),
    __metadata("design:returntype", void 0)
], VendorsController.prototype, "getAvailability", null);
__decorate([
    (0, common_1.Patch)(':id/availability/:availabilityId'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.SUPERADMIN, user_role_enum_1.UserRole.ADMIN_OWNER),
    (0, swagger_1.ApiOperation)({ summary: 'Update vendor availability' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Vendor availability updated successfully' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Param)('availabilityId', common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, dto_1.UpdateVendorAvailabilityDto,
        user_entity_1.User]),
    __metadata("design:returntype", void 0)
], VendorsController.prototype, "updateAvailability", null);
__decorate([
    (0, common_1.Delete)(':id/availability/:availabilityId'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.SUPERADMIN, user_role_enum_1.UserRole.ADMIN_OWNER),
    (0, swagger_1.ApiOperation)({ summary: 'Delete vendor availability' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Vendor availability deleted successfully' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Param)('availabilityId', common_1.ParseUUIDPipe)),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, user_entity_1.User]),
    __metadata("design:returntype", void 0)
], VendorsController.prototype, "removeAvailability", null);
exports.VendorsController = VendorsController = __decorate([
    (0, swagger_1.ApiTags)('vendors'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, tenant_guard_1.TenantGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)({ path: 'vendors', version: '1' }),
    __metadata("design:paramtypes", [vendors_service_1.VendorsService])
], VendorsController);
//# sourceMappingURL=vendors.controller.js.map