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
exports.CreateUnitDto = exports.UnitType = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
var UnitType;
(function (UnitType) {
    UnitType["APARTMENT"] = "apartment";
    UnitType["STORE"] = "store";
    UnitType["GARAGE"] = "garage";
})(UnitType || (exports.UnitType = UnitType = {}));
class CreateUnitDto {
    buildingId;
    label;
    type;
    floor;
    m2;
    isRented;
}
exports.CreateUnitDto = CreateUnitDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid-building-id' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateUnitDto.prototype, "buildingId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '4A' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateUnitDto.prototype, "label", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'apartment', enum: UnitType }),
    (0, class_validator_1.IsEnum)(UnitType),
    __metadata("design:type", String)
], CreateUnitDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 4 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateUnitDto.prototype, "floor", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 85.5 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateUnitDto.prototype, "m2", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: false, required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateUnitDto.prototype, "isRented", void 0);
//# sourceMappingURL=create-unit.dto.js.map