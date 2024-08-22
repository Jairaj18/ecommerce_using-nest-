import { Body, Controller, Post, Res, UseGuards, HttpStatus, Get, Req, Query, Param } from '@nestjs/common';
import { ProductService } from './product.service';
import { Role } from '@prisma/client';
import { Roles } from '../auth/role.decorator';
import { RoleGuard } from '../auth/role.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateProductDto } from './dto/create-product.dto';
import {UpdateProductDto} from './dto/update-product.dto'
import { Response } from 'express';
import { getProductQueryDto } from './dto/productQuery.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('/addproduct')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  async createProduct(
    @Body() createProductDto: CreateProductDto, 
    @Res() res: Response,
    @Req() req: Request
  ): Promise<Response> {
    try {
      console.log("Creating product...",req);
      const createdProduct = await this.productService.createProduct(createProductDto);
      return res.json(createdProduct);
    } catch (error) {
      return res.json({ 
        message: 'Failed to create product', 
        error: error.message 
      });
    }
  }

  @Post('/updateProduct/:productId')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  async updateProduct(
    @Param() productId: string,
    @Body() data: UpdateProductDto,
    @Res() res: Response,
  ): Promise<void> {
    try {
      await this.productService.updateProduct(
        productId,
        data.name,
        data.urlName,
        data.picture,
        data.price,
        data.discountPercentage,
        data.stock,
        data.description
      );
      res.send({ message: 'Product updated successfully' });
    } catch (error) {
      res.send({ message: 'Failed to update product', error });
    }
  }
  @Get('/allproducts')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  async getAllProduct(
    @Query() options: getProductQueryDto,
    @Res() res: Response
  ): Promise<Response> {
    try {
      const allProducts = await this.productService.getAllProduct(
        options.search,
      );
      return res.json(allProducts);
    } catch (error) {
      return res.json({ 
        message: 'No Products Found', 
        error: error.message 
      });
    }
    
  }

}

