import { TicketStatus } from '../../entities/ticket.entity';
import { AssignInspectorDto, CreateTicketDto, UpdateTicketDto } from './dto';
import { TicketsService } from './tickets.service';
export declare class TicketsController {
    private readonly ticketsService;
    constructor(ticketsService: TicketsService);
    create(createTicketDto: CreateTicketDto, user: any): Promise<import("../../entities/ticket.entity").Ticket>;
    findAll(user: any, page?: number, limit?: number, status?: TicketStatus, buildingId?: string, unitId?: string): Promise<{
        data: import("../../entities/ticket.entity").Ticket[];
        total: number;
        page: number;
        limit: number;
    }>;
    getStats(user: any): Promise<Record<string, number>>;
    findOne(id: string, user: any): Promise<import("../../entities/ticket.entity").Ticket>;
    update(id: string, updateTicketDto: UpdateTicketDto, user: any): Promise<import("../../entities/ticket.entity").Ticket>;
    remove(id: string, user: any): Promise<void>;
    assignInspector(id: string, assignInspectorDto: AssignInspectorDto, user: any): Promise<import("../../entities").Inspection>;
}
