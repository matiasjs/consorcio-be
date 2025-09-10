import { Repository } from 'typeorm';
import { UnitOccupancy } from '../../entities/unit-occupancy.entity';
import { Unit } from '../../entities/unit.entity';
import { CreateUnitDto, CreateUnitOccupancyDto, UpdateUnitDto } from './dto';
export declare class UnitsService {
    private readonly unitRepository;
    private readonly occupancyRepository;
    constructor(unitRepository: Repository<Unit>, occupancyRepository: Repository<UnitOccupancy>);
    create(createUnitDto: CreateUnitDto, adminId: string): Promise<Unit>;
    findAll(adminId: string): Promise<Unit[]>;
    findOne(id: string, adminId: string): Promise<Unit>;
    update(id: string, updateUnitDto: UpdateUnitDto, adminId: string): Promise<Unit>;
    remove(id: string, adminId: string): Promise<void>;
    createOccupancy(unitId: string, createOccupancyDto: CreateUnitOccupancyDto, adminId: string): Promise<UnitOccupancy>;
    getOccupancy(unitId: string, adminId: string): Promise<UnitOccupancy[]>;
}
