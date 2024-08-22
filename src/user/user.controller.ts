// src/user/user.controller.ts

import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/role.decorator';
import { RoleGuard } from '../auth/role.guard';
import { Role } from './role.enum';
import { AuthDto } from '../auth/dto/auth-credentials.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('alluser')
  @UseGuards(AuthGuard(), RoleGuard)
  @Roles(Role.ADMIN) // Only users with the ADMIN role can access this route
  getAllUsers() {
    return this.userService.findAll();
  }

  @Post()
  @UseGuards(AuthGuard())
  async createUser(@Body() authCredentialsDto: AuthDto) {
    return this.userService.createUser(authCredentialsDto.email, authCredentialsDto.password, authCredentialsDto.name, authCredentialsDto.address);
  }
  
}
