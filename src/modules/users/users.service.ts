import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { Role } from '../../entities/role.entity';
import { User } from '../../entities/user.entity';
import { CreateUserDto, UpdateUserDto } from './dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async create(createUserDto: CreateUserDto, adminId: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // Create user
    const user = this.userRepository.create({
      email: createUserDto.email,
      phone: createUserDto.phone,
      passwordHash: hashedPassword,
      fullName: createUserDto.fullName,
      status: (createUserDto.status as any) || 'ACTIVE',
      adminId,
    });

    const savedUser = await this.userRepository.save(user);

    // Assign roles if provided
    if (createUserDto.roleIds && createUserDto.roleIds.length > 0) {
      const roles = await this.roleRepository.findByIds(createUserDto.roleIds);
      savedUser.roles = roles;
      await this.userRepository.save(savedUser);
    }

    return savedUser;
  }

  async findAll(adminId: string): Promise<User[]> {
    return this.userRepository.find({
      where: { adminId },
      relations: ['administration', 'roles'],
    });
  }

  async findOne(id: string, adminId: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id, adminId },
      relations: ['administration'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
    adminId: string,
  ): Promise<User> {
    const user = await this.findOne(id, adminId);

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }

  async remove(id: string, adminId: string): Promise<void> {
    const user = await this.findOne(id, adminId);
    await this.userRepository.softDelete(id);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
      relations: ['administration'],
    });
  }
}
