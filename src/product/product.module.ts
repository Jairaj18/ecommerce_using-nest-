import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthModule } from '../auth/auth.module'; 
import { RoleGuard } from '../auth/role.guard'; 
import { JwtService } from '@nestjs/jwt'; 
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [AuthModule,
    PassportModule.register({ defaultStrategy: 'jwt' }), 
  ],
  providers: [ProductService, PrismaService, RoleGuard, JwtService],
  controllers: [ProductController],
})
export class ProductModule {}
