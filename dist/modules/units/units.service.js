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
exports.UnitsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const unit_occupancy_entity_1 = require("../../entities/unit-occupancy.entity");
const unit_entity_1 = require("../../entities/unit.entity");
let UnitsService = class UnitsService {
    unitRepository;
    occupancyRepository;
    constructor(unitRepository, occupancyRepository) {
        this.unitRepository = unitRepository;
        this.occupancyRepository = occupancyRepository;
    }
    async create(createUnitDto, adminId) {
        const unit = this.unitRepository.create({
            buildingId: createUnitDto.buildingId,
            label: createUnitDto.label,
            type: createUnitDto.type,
            floor: createUnitDto.floor,
            m2: createUnitDto.m2,
            isRented: createUnitDto.isRented || false,
        });
        return this.unitRepository.save(unit);
    }
    async findAll(adminId) {
        return this.unitRepository.find({
            where: { building: { adminId } },
            relations: ['building', 'occupancies'],
        });
    }
    async findOne(id, adminId) {
        const unit = await this.unitRepository.findOne({
            where: { id, building: { adminId } },
            relations: ['building', 'occupancies'],
        });
        if (!unit) {
            throw new common_1.NotFoundException(`Unit with ID ${id} not found`);
        }
        return unit;
    }
    async update(id, updateUnitDto, adminId) {
        const unit = await this.findOne(id, adminId);
        Object.assign(unit, updateUnitDto);
        return this.unitRepository.save(unit);
    }
    async remove(id, adminId) {
        const unit = await this.findOne(id, adminId);
        await this.unitRepository.softDelete(id);
    }
    async createOccupancy(unitId, createOccupancyDto, adminId) {
        const unit = await this.findOne(unitId, adminId);
        const occupancy = this.occupancyRepository.create({
            unitId,
            ownerUserId: createOccupancyDto.ownerUserId,
            tenantUserId: createOccupancyDto.tenantUserId,
            startDate: new Date(createOccupancyDto.startDate),
            endDate: createOccupancyDto.endDate ? new Date(createOccupancyDto.endDate) : undefined,
        });
        return this.occupancyRepository.save(occupancy);
    }
    async getOccupancy(unitId, adminId) {
        const unit = await this.findOne(unitId, adminId);
        return this.occupancyRepository.find({
            where: { unitId },
            relations: ['unit', 'ownerUser', 'tenantUser'],
        });
    }
};
exports.UnitsService = UnitsService;
exports.UnitsService = UnitsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(unit_entity_1.Unit)),
    __param(1, (0, typeorm_1.InjectRepository)(unit_occupancy_entity_1.UnitOccupancy)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], UnitsService);
//# sourceMappingURL=units.service.js.map