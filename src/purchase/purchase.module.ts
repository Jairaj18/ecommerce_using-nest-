import { Module } from '@nestjs/common';
import { PurchaseController } from './purchase.controller';
import { PurchaseService } from './purchase.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthModule } from 'src/auth/auth.module';
import { RoleGuard } from 'src/auth/role.guard';
import { JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [AuthModule,
    PassportModule.register({ defaultStrategy: 'jwt' }), 
  ],
  controllers: [PurchaseController],
  providers: [PurchaseService, PrismaService,RoleGuard,JwtService],
})
export class PurchaseModule {}
