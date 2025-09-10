import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { CreateUserDto, UpdateUserDto } from './dto';
export declare class UsersService {
    private readonly userRepository;
    constructor(userRepository: Repository<User>);
    create(createUserDto: CreateUserDto, adminId: string): Promise<User>;
    findAll(adminId: string): Promise<User[]>;
    findOne(id: string, adminId: string): Promise<User>;
    update(id: string, updateUserDto: UpdateUserDto, adminId: string): Promise<User>;
    remove(id: string, adminId: string): Promise<void>;
    findByEmail(email: string): Promise<User | null>;
}
