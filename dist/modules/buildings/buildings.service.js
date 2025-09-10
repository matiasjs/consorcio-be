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
exports.BuildingsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const building_entity_1 = require("../../entities/building.entity");
let BuildingsService = class BuildingsService {
    buildingRepository;
    constructor(buildingRepository) {
        this.buildingRepository = buildingRepository;
    }
    async create(createBuildingDto, adminId) {
        const building = this.buildingRepository.create({
            ...createBuildingDto,
            adminId,
        });
        return this.buildingRepository.save(building);
    }
    async findAll(adminId) {
        return this.buildingRepository.find({
            where: { adminId },
            relations: ['administration', 'units'],
        });
    }
    async findOne(id, adminId) {
        const building = await this.buildingRepository.findOne({
            where: { id, adminId },
            relations: ['administration', 'units'],
        });
        if (!building) {
            throw new common_1.NotFoundException(`Building with ID ${id} not found`);
        }
        return building;
    }
    async update(id, updateBuildingDto, adminId) {
        const building = await this.findOne(id, adminId);
        Object.assign(building, updateBuildingDto);
        return this.buildingRepository.save(building);
    }
    async remove(id, adminId) {
        const building = await this.findOne(id, adminId);
        await this.buildingRepository.softDelete(id);
    }
};
exports.BuildingsService = BuildingsService;
exports.BuildingsService = BuildingsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(building_entity_1.Building)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], BuildingsService);
//# sourceMappingURL=buildings.service.js.map