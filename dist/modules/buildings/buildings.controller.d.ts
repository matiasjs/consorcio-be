import { User } from '../../entities/user.entity';
import { BuildingsService } from './buildings.service';
import { CreateBuildingDto, UpdateBuildingDto } from './dto';
export declare class BuildingsController {
    private readonly buildingsService;
    constructor(buildingsService: BuildingsService);
    create(createBuildingDto: CreateBuildingDto, currentUser: User): Promise<import("../../entities").Building>;
    findAll(currentUser: User): Promise<import("../../entities").Building[]>;
    findOne(id: string, currentUser: User): Promise<import("../../entities").Building>;
    update(id: string, updateBuildingDto: UpdateBuildingDto, currentUser: User): Promise<import("../../entities").Building>;
    remove(id: string, currentUser: User): Promise<void>;
}
