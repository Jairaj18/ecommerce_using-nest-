/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProductModule } from './product/product.module';
import { ConfigModule } from '@nestjs/config';
import { PurchaseModule } from './purchase/purchase.module';
import { PassportModule } from '@nestjs/passport';
import { StripeModule } from './stripe/stripe.module';

@Module({
  imports: [  
    ConfigModule.forRoot({
      isGlobal: true
    }),
    AuthModule, UserModule, PrismaModule, ProductModule, PurchaseModule,
    StripeModule.forRoot(process.env.Stripe_Key,{apiVersion:'2024-06-20'})],
  controllers: [],
  providers: [],
})
export class AppModule {}