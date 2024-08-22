import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }) 
  ],
  providers: [UserService,PrismaService],
  controllers: [UserController],
  exports:[UserModule]
})
export class UserModule {}
