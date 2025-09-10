import { User } from '../../entities/user.entity';
import { CreateUserDto, UpdateUserDto } from './dto';
import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(createUserDto: CreateUserDto, currentUser: User): Promise<User>;
    findAll(currentUser: User): Promise<User[]>;
    findOne(id: string, currentUser: User): Promise<User>;
    update(id: string, updateUserDto: UpdateUserDto, currentUser: User): Promise<User>;
    remove(id: string, currentUser: User): Promise<void>;
}
