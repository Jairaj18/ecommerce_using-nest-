import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { CreateProductDto } from './dto/create-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma, Product } from '@prisma/client';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async createProduct(createProductDto: CreateProductDto) {
    const { categories, ...productData } = createProductDto;

    const categoriesConnection = categories.map((type) => ({
      where: { type },
      create: { type },
    }));
    console.log('categoriesConnection', categoriesConnection);

    try {
      return await this.prisma.product.create({
        data: {
          ...productData,
          categories: {
            connectOrCreate: categoriesConnection, 
          },
        },
        include: {
          categories: true,
        },
      });
    } catch (error) {
      console.error('Error creating product:', error);
      throw new Error(`Failed to create product: ${error.message}`);
    }
  }

  async updateProduct(
    productId: string, 
    name?: string,
    urlName?: string,
    picture?: string,
    price?: number,
    discountPercentage?: number,
    stock?: number,
    description?: string,
  ): Promise<void> {
    await this.prisma.product.update({
      where: {
        id: productId, 
      },
      data: {
        name: name,
        urlName: urlName,
        picture: picture,
        price: price,
        discountPercentage: discountPercentage,
        stock: stock,
        description: description,
      },
    });
  }

  async getAllProduct(search: string): Promise<Product[]> {
    return this.prisma.product.findMany();
  }
}
