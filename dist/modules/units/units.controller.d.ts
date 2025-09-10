import { User } from '../../entities/user.entity';
import { CreateUnitDto, CreateUnitOccupancyDto, UpdateUnitDto } from './dto';
import { UnitsService } from './units.service';
export declare class UnitsController {
    private readonly unitsService;
    constructor(unitsService: UnitsService);
    create(createUnitDto: CreateUnitDto, currentUser: User): Promise<import("../../entities").Unit>;
    findAll(currentUser: User): Promise<import("../../entities").Unit[]>;
    findOne(id: string, currentUser: User): Promise<import("../../entities").Unit>;
    update(id: string, updateUnitDto: UpdateUnitDto, currentUser: User): Promise<import("../../entities").Unit>;
    remove(id: string, currentUser: User): Promise<void>;
    createOccupancy(id: string, createOccupancyDto: CreateUnitOccupancyDto, currentUser: User): Promise<import("../../entities").UnitOccupancy>;
    getOccupancy(id: string, currentUser: User): Promise<import("../../entities").UnitOccupancy[]>;
}
