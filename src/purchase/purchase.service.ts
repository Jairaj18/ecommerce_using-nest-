import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePurchaseDto } from './dto/purchase.dto';

@Injectable()
export class PurchaseService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createPurchaseDto: any) {
    const { products, reviewComment, createdAt } = createPurchaseDto;

    console.log(createPurchaseDto);

    if (!userId) {
      throw new Error('User ID must be provided');
    }

    // Validate and calculate product amounts and update stock
    const productAmounts = await Promise.all(
      products.map(async (p: any) => {
        const product = await this.prisma.product.findUnique({
          where: { id: p.productId },
          select: { price: true, stock: true, name: true },
        });

        if (!product) {
          throw new Error(`Product with ID ${p.productId} not found.`);
        }

        if (product.stock < p.quantity) {
          throw new Error(`Not enough stock for product ${product.name}. Available stock: ${product.stock}`);
        }

        await this.prisma.product.update({
          where: { id: p.productId },
          data: { stock: product.stock - p.quantity },
        });

        return { ...p, amount: p.quantity * product.price };
      }),
    );
    
    const totalAmount = productAmounts.reduce((sum, p) => sum + p.amount, 0);
    
    try {
      // Create the purchase record
      const purchase = await this.prisma.purchase.create({
        data: {
          user: {
            connect: {
              id: userId,
            },
          },
          reviewComment,
          amount: totalAmount,
          createdAt: new Date(),
          products: {
            create: products.map(product => ({
              product: {
                connect: {
                  id: product.productId,
                },
              },
              quantity: product.quantity,
              createdAt: new Date(),
            })),
          },
        },
        include: {
          products: {
            include: {
              product: {  // Include related product details
                select: {
                  name: true,
                  price: true,
                },
              },
            },
          },
        },
      });

      return purchase;
    } catch (error) {
      throw new Error(`Failed to create purchase: ${error.message}`);
    }
  }
}
