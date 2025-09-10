import { PaginationDto } from '../../common/dto';
import { AdministrationsService } from './administrations.service';
import { CreateAdministrationDto, UpdateAdministrationDto } from './dto';
export declare class AdministrationsController {
    private readonly administrationsService;
    constructor(administrationsService: AdministrationsService);
    create(createAdministrationDto: CreateAdministrationDto): Promise<import("../../entities").Administration>;
    findAll(paginationDto: PaginationDto): Promise<import("../../common/dto").PaginatedResponseDto<import("../../entities").Administration>>;
    findOne(id: string): Promise<import("../../entities").Administration>;
    update(id: string, updateAdministrationDto: UpdateAdministrationDto): Promise<import("../../entities").Administration>;
    remove(id: string): Promise<void>;
}
