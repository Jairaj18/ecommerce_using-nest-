import { IsArray, IsNumber, IsOptional, IsString, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { IsUUID, IsInt, IsPositive } from 'class-validator';

export class ProductDto {
  @IsUUID(4)
  productId: string;

  @IsInt()
  @IsPositive()
  quantity: number;
}

export class CreatePurchaseDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductDto)
  products: ProductDto[];

  @IsString()
  @IsOptional()
  reviewComment?: string;

  @IsNumber()
  @Min(0)
  amount?: number;

  @IsString()
  @IsOptional()
  createdAt?: string; 
}
