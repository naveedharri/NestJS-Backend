import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly redisService: RedisService,
  ) {}

  /**
   * Create a new user
   * @param createUserDto - Data Transfer Object for user creation
   * @returns Object with user data and status code
   */
  async create(
    createUserDto: CreateUserDto,
  ): Promise<{ user?: User; status: number }> {
    try {
      // Check if a user with the provided email already exists
      const existingUser = await this.userRepository.findOne({
        where: { email: createUserDto.email },
      });

      if (existingUser) {
        // Status 2: Email already exists
        return { status: 2 };
      }

      // Create and save the user
      const newUser = this.userRepository.create(createUserDto);
      const user = await this.userRepository.save(newUser);

      // Publish welcome message to Redis
      const publisher = this.redisService.getPublisher();
      publisher.publish(
        'user:welcome',
        JSON.stringify({ email: user.email, name: user.name }),
      );

      // Status 1: User created successfully
      return { user, status: 1 };
    } catch (error) {
      console.error('Error creating user:', error);
      return { status: 0 };
    }
  }

  /**
   * Find all users
   */
  async findAll(): Promise<{ users?: User[]; status: number }> {
    try {
      const users = await this.userRepository.find();

      if (users.length > 0) {
        return { users, status: 1 }; // Users found
      } else {
        return { users: [], status: 2 }; // No users found
      }
    } catch (error) {
      console.error('Error finding users:', error);
      return { status: 0 }; // Error occurred
    }
  }
}
