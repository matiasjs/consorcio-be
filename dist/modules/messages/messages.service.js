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
exports.MessagesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const message_entity_1 = require("../../entities/message.entity");
let MessagesService = class MessagesService {
    messageRepository;
    constructor(messageRepository) {
        this.messageRepository = messageRepository;
    }
    async create(createMessageDto, authorUserId) {
        const message = this.messageRepository.create({
            ...createMessageDto,
            authorUserId,
        });
        return this.messageRepository.save(message);
    }
    async findByEntity(entityType, entityId, page = 1, limit = 20) {
        const [data, total] = await this.messageRepository.findAndCount({
            where: { entityType: entityType, entityId },
            relations: ['author', 'readByUser'],
            order: { createdAt: 'ASC' },
            skip: (page - 1) * limit,
            take: limit,
        });
        return { data, total, page, limit };
    }
    async markAsRead(id, readByUserId) {
        const message = await this.messageRepository.findOne({
            where: { id },
        });
        if (!message) {
            throw new common_1.NotFoundException('Message not found');
        }
        message.isRead = true;
        message.readAt = new Date();
        message.readByUserId = readByUserId;
        return this.messageRepository.save(message);
    }
    async getUnreadCount(entityType, entityId) {
        return this.messageRepository.count({
            where: {
                entityType: entityType,
                entityId,
                isRead: false,
            },
        });
    }
};
exports.MessagesService = MessagesService;
exports.MessagesService = MessagesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(message_entity_1.Message)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], MessagesService);
//# sourceMappingURL=messages.service.js.map