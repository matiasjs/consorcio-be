import { Repository } from 'typeorm';
import { Ticket, TicketStatus } from '../../entities/ticket.entity';
import { Inspection } from '../../entities/inspection.entity';
import { CreateTicketDto, UpdateTicketDto, AssignInspectorDto } from './dto';
export declare class TicketsService {
    private ticketRepository;
    private inspectionRepository;
    constructor(ticketRepository: Repository<Ticket>, inspectionRepository: Repository<Inspection>);
    create(createTicketDto: CreateTicketDto, createdByUserId: string, adminId: string): Promise<Ticket>;
    findAll(adminId: string, page?: number, limit?: number, status?: TicketStatus, buildingId?: string, unitId?: string): Promise<{
        data: Ticket[];
        total: number;
        page: number;
        limit: number;
    }>;
    findOne(id: string, adminId: string): Promise<Ticket>;
    update(id: string, updateTicketDto: UpdateTicketDto, adminId: string): Promise<Ticket>;
    remove(id: string, adminId: string): Promise<void>;
    assignInspector(ticketId: string, assignInspectorDto: AssignInspectorDto, adminId: string): Promise<Inspection>;
    getTicketsByStatus(adminId: string): Promise<Record<string, number>>;
}
