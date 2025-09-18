import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { User, Role } from '../../../entities';
import { AssignRolesDto } from '../dto';

@Injectable()
export class UserRolesService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async assignRoles(
    userId: string,
    assignRolesDto: AssignRolesDto,
    adminId: string,
  ): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId, adminId },
      relations: ['roles'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID "${userId}" not found`);
    }

    const { add = [], remove = [] } = assignRolesDto;

    if (add.length > 0) {
      const rolesToAdd = await this.roleRepository.find({
        where: { name: In(add), adminId },
      });

      if (rolesToAdd.length !== add.length) {
        const foundNames = rolesToAdd.map((r) => r.name);
        const notFound = add.filter((name) => !foundNames.includes(name));
        throw new NotFoundException(`Roles not found: ${notFound.join(', ')}`);
      }

      user.roles = [...(user.roles || []), ...rolesToAdd];
    }

    if (remove.length > 0) {
      user.roles = (user.roles || []).filter(
        (role) => !remove.includes(role.name),
      );
    }

    return (await this.userRepository.save(user)) as any;
  }

  async getUserWithRoles(userId: string, adminId: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId, adminId },
      relations: ['roles', 'roles.permissions'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID "${userId}" not found`);
    }

    return user;
  }
}
