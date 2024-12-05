import {
  Controller,
  Get,
  Post,
  Body,
  Res,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Response } from 'express';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * Create a User
   * @param res - Express Response object
   */

  @Post()
  async create(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    try {
      const { user, status } = await this.userService.create(createUserDto);
      if (status == 1) {
        return res.status(HttpStatus.OK).json({
          message: 'User Created Successfully!',
          status: 1,
          result: user,
        });
      } else if (status == 2) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: `User with email '${createUserDto?.email}' already exists. Please choose a different username.`,
          status: 0,
        });
      } else {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: `Something went wrong, please check logs`,
          status: 0,
        });
      }
    } catch (error) {
      throw new HttpException(
        `Sorry! Something went wrong while registering, ${error.message}`,
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  /**
   * Get a list of all users
   */
  @Get()
  async listAll(@Res() res: Response) {
    try {
      const { users, status } = await this.userService.findAll();

      if (status === 1) {
        return res.status(HttpStatus.OK).json({
          message: 'Users retrieved successfully!',
          status: 1,
          result: users,
        });
      } else if (status === 2) {
        return res.status(HttpStatus.OK).json({
          message: 'No users found.',
          status: 0,
          result: [],
        });
      } else {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: 'Something went wrong while retrieving users.',
          status: 0,
        });
      }
    } catch (error) {
      throw new HttpException(
        `Sorry! Something went wrong while retrieving users, ${error.message}`,
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
