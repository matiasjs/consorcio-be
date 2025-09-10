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
exports.TicketsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const ticket_entity_1 = require("../../entities/ticket.entity");
const inspection_entity_1 = require("../../entities/inspection.entity");
let TicketsService = class TicketsService {
    ticketRepository;
    inspectionRepository;
    constructor(ticketRepository, inspectionRepository) {
        this.ticketRepository = ticketRepository;
        this.inspectionRepository = inspectionRepository;
    }
    async create(createTicketDto, createdByUserId, adminId) {
        const ticket = this.ticketRepository.create({
            ...createTicketDto,
            createdByUserId,
            adminId,
            dueDate: createTicketDto.dueDate ? new Date(createTicketDto.dueDate) : undefined,
        });
        return this.ticketRepository.save(ticket);
    }
    async findAll(adminId, page = 1, limit = 10, status, buildingId, unitId) {
        const queryBuilder = this.ticketRepository
            .createQueryBuilder('ticket')
            .leftJoinAndSelect('ticket.building', 'building')
            .leftJoinAndSelect('ticket.unit', 'unit')
            .leftJoinAndSelect('ticket.createdByUser', 'createdByUser')
            .leftJoinAndSelect('ticket.inspections', 'inspections')
            .leftJoinAndSelect('ticket.workOrders', 'workOrders')
            .where('ticket.adminId = :adminId', { adminId });
        if (status) {
            queryBuilder.andWhere('ticket.status = :status', { status });
        }
        if (buildingId) {
            queryBuilder.andWhere('ticket.buildingId = :buildingId', { buildingId });
        }
        if (unitId) {
            queryBuilder.andWhere('ticket.unitId = :unitId', { unitId });
        }
        const [data, total] = await queryBuilder
            .orderBy('ticket.createdAt', 'DESC')
            .skip((page - 1) * limit)
            .take(limit)
            .getManyAndCount();
        return { data, total, page, limit };
    }
    async findOne(id, adminId) {
        const ticket = await this.ticketRepository.findOne({
            where: { id, adminId },
            relations: [
                'building',
                'unit',
                'createdByUser',
                'resolvedByUser',
                'inspections',
                'inspections.inspector',
                'workOrders',
                'workOrders.vendor',
                'messages',
                'messages.author',
            ],
        });
        if (!ticket) {
            throw new common_1.NotFoundException('Ticket not found');
        }
        return ticket;
    }
    async update(id, updateTicketDto, adminId) {
        const ticket = await this.findOne(id, adminId);
        Object.assign(ticket, {
            ...updateTicketDto,
            resolvedAt: updateTicketDto.resolvedAt ? new Date(updateTicketDto.resolvedAt) : ticket.resolvedAt,
            dueDate: updateTicketDto.dueDate ? new Date(updateTicketDto.dueDate) : ticket.dueDate,
        });
        return this.ticketRepository.save(ticket);
    }
    async remove(id, adminId) {
        const ticket = await this.findOne(id, adminId);
        await this.ticketRepository.softRemove(ticket);
    }
    async assignInspector(ticketId, assignInspectorDto, adminId) {
        const ticket = await this.findOne(ticketId, adminId);
        const existingInspection = await this.inspectionRepository.findOne({
            where: {
                ticketId,
                status: inspection_entity_1.InspectionStatus.SCHEDULED,
            },
        });
        if (existingInspection) {
            throw new common_1.ForbiddenException('Ticket already has a pending inspection');
        }
        const inspection = this.inspectionRepository.create({
            ticketId,
            inspectorUserId: assignInspectorDto.inspectorUserId,
            scheduledAt: new Date(assignInspectorDto.scheduledAt),
            notes: assignInspectorDto.notes,
        });
        ticket.status = ticket_entity_1.TicketStatus.PENDING_INSPECTION;
        await this.ticketRepository.save(ticket);
        return this.inspectionRepository.save(inspection);
    }
    async getTicketsByStatus(adminId) {
        const result = await this.ticketRepository
            .createQueryBuilder('ticket')
            .select('ticket.status', 'status')
            .addSelect('COUNT(*)', 'count')
            .where('ticket.adminId = :adminId', { adminId })
            .groupBy('ticket.status')
            .getRawMany();
        const statusCounts = {};
        result.forEach((row) => {
            statusCounts[row.status] = parseInt(row.count);
        });
        return statusCounts;
    }
};
exports.TicketsService = TicketsService;
exports.TicketsService = TicketsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(ticket_entity_1.Ticket)),
    __param(1, (0, typeorm_1.InjectRepository)(inspection_entity_1.Inspection)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], TicketsService);
//# sourceMappingURL=tickets.service.js.map