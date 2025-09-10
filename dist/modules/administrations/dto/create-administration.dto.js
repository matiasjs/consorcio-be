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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateAdministrationDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const administration_entity_1 = require("../../../entities/administration.entity");
class CreateAdministrationDto {
    name;
    cuit;
    email;
    phone;
    address;
    planTier;
}
exports.CreateAdministrationDto = CreateAdministrationDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Administration name',
        example: 'Administración Central',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(2, 255),
    __metadata("design:type", String)
], CreateAdministrationDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'CUIT number',
        example: '20-12345678-9',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^\d{2}-\d{8}-\d{1}$/, {
        message: 'CUIT must be in format XX-XXXXXXXX-X',
    }),
    __metadata("design:type", String)
], CreateAdministrationDto.prototype, "cuit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Email address',
        example: 'admin@administracion.com',
    }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CreateAdministrationDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Phone number',
        example: '+54 11 1234-5678',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 50),
    __metadata("design:type", String)
], CreateAdministrationDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Address',
        example: 'Av. Corrientes 1234, CABA',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAdministrationDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Plan tier',
        enum: administration_entity_1.PlanTier,
        example: administration_entity_1.PlanTier.BASIC,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(administration_entity_1.PlanTier),
    __metadata("design:type", String)
], CreateAdministrationDto.prototype, "planTier", void 0);
//# sourceMappingURL=create-administration.dto.js.map