import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { UserService } from 'src/user/user.service';
import { JwtStrategy } from './jwt.strategy';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { RoleGuard } from './role.guard';
import { Reflector } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NodemailerService } from './email.services';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PassportModule.register({ defaultStrategy: 'local' }), // Register PassportModule here
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '5h' },
      }),
    }),
  ],
  providers: [
    AuthService,
    UserService,
    JwtStrategy,
    PrismaService,
    RoleGuard,
    Reflector,
    NodemailerService,
  ],
  controllers: [AuthController],
  exports: [AuthService, JwtStrategy, JwtModule, NodemailerService], 
})
export class AuthModule {}
