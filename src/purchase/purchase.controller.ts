import { Body, Controller, Param, Post, UseGuards, HttpException, HttpStatus, Inject } from '@nestjs/common';  
import { CreatePurchaseDto } from './dto/purchase.dto';  
import { Purchase } from '@prisma/client';  
import { PurchaseService } from './purchase.service';  
import { Roles } from 'src/auth/role.decorator';  
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';  
import { RoleGuard } from 'src/auth/role.guard';  
import { Role } from 'src/user/role.enum';
import { STRIPE_CLIENT } from 'src/stripe/constant';
import Stripe from 'stripe';

@Controller('purchase')  
export class PurchaseController {  
  constructor(
    @Inject(STRIPE_CLIENT) private stripe: Stripe,
    private readonly purchaseService: PurchaseService) {}  

  @Roles(Role.USER) 
  @UseGuards(JwtAuthGuard,RoleGuard)  
  @Post(':userId') 
  async createPurchase(  
    @Param('userId') userId: string,
    @Body() body: CreatePurchaseDto,
  ): Promise<Purchase> {  
    if (!userId) {  
      throw new HttpException('User ID is required', HttpStatus.BAD_REQUEST);  
    }  
    try {  
      return await this.purchaseService.create(userId, body);  
    } catch (error) {  
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);  
    }  
  }  
}