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
exports.AdministrationsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const administration_entity_1 = require("../../entities/administration.entity");
let AdministrationsService = class AdministrationsService {
    administrationRepository;
    constructor(administrationRepository) {
        this.administrationRepository = administrationRepository;
    }
    async create(createAdministrationDto) {
        const existingByCuit = await this.administrationRepository.findOne({
            where: { cuit: createAdministrationDto.cuit },
        });
        if (existingByCuit) {
            throw new common_1.ConflictException('Administration with this CUIT already exists');
        }
        const existingByEmail = await this.administrationRepository.findOne({
            where: { email: createAdministrationDto.email },
        });
        if (existingByEmail) {
            throw new common_1.ConflictException('Administration with this email already exists');
        }
        const administration = this.administrationRepository.create(createAdministrationDto);
        return this.administrationRepository.save(administration);
    }
    async findAll(paginationDto) {
        const { page = 1, limit = 20, sort } = paginationDto;
        const skip = (page - 1) * limit;
        const queryBuilder = this.administrationRepository.createQueryBuilder('administration');
        if (sort) {
            const sortFields = sort.split(',');
            sortFields.forEach((field, index) => {
                const isDescending = field.startsWith('-');
                const fieldName = isDescending ? field.substring(1) : field;
                const direction = isDescending ? 'DESC' : 'ASC';
                if (index === 0) {
                    queryBuilder.orderBy(`administration.${fieldName}`, direction);
                }
                else {
                    queryBuilder.addOrderBy(`administration.${fieldName}`, direction);
                }
            });
        }
        else {
            queryBuilder.orderBy('administration.createdAt', 'DESC');
        }
        const [data, total] = await queryBuilder
            .skip(skip)
            .take(limit)
            .getManyAndCount();
        const totalPages = Math.ceil(total / limit);
        return {
            data,
            meta: {
                page,
                limit,
                total,
                totalPages,
                hasNextPage: page < totalPages,
                hasPreviousPage: page > 1,
            },
        };
    }
    async findOne(id) {
        const administration = await this.administrationRepository.findOne({
            where: { id },
            relations: ['users', 'buildings'],
        });
        if (!administration) {
            throw new common_1.NotFoundException('Administration not found');
        }
        return administration;
    }
    async update(id, updateAdministrationDto) {
        const administration = await this.findOne(id);
        if (updateAdministrationDto.email && updateAdministrationDto.email !== administration.email) {
            const existingByEmail = await this.administrationRepository.findOne({
                where: { email: updateAdministrationDto.email },
            });
            if (existingByEmail) {
                throw new common_1.ConflictException('Administration with this email already exists');
            }
        }
        Object.assign(administration, updateAdministrationDto);
        return this.administrationRepository.save(administration);
    }
    async remove(id) {
        const administration = await this.findOne(id);
        await this.administrationRepository.softDelete(id);
    }
};
exports.AdministrationsService = AdministrationsService;
exports.AdministrationsService = AdministrationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(administration_entity_1.Administration)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], AdministrationsService);
//# sourceMappingURL=administrations.service.js.map