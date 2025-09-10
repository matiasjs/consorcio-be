import { Repository } from 'typeorm';
import { Administration } from '../../entities/administration.entity';
import { CreateAdministrationDto, UpdateAdministrationDto } from './dto';
import { PaginationDto, PaginatedResponseDto } from '../../common/dto';
export declare class AdministrationsService {
    private administrationRepository;
    constructor(administrationRepository: Repository<Administration>);
    create(createAdministrationDto: CreateAdministrationDto): Promise<Administration>;
    findAll(paginationDto: PaginationDto): Promise<PaginatedResponseDto<Administration>>;
    findOne(id: string): Promise<Administration>;
    update(id: string, updateAdministrationDto: UpdateAdministrationDto): Promise<Administration>;
    remove(id: string): Promise<void>;
}
