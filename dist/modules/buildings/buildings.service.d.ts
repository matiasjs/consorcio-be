import { Repository } from 'typeorm';
import { Building } from '../../entities/building.entity';
import { CreateBuildingDto, UpdateBuildingDto } from './dto';
export declare class BuildingsService {
    private readonly buildingRepository;
    constructor(buildingRepository: Repository<Building>);
    create(createBuildingDto: CreateBuildingDto, adminId: string): Promise<Building>;
    findAll(adminId: string): Promise<Building[]>;
    findOne(id: string, adminId: string): Promise<Building>;
    update(id: string, updateBuildingDto: UpdateBuildingDto, adminId: string): Promise<Building>;
    remove(id: string, adminId: string): Promise<void>;
}
