import { IsString, IsNumber, IsOptional, IsArray, IsEnum, Min, Max, ArrayMinSize } from 'class-validator';

enum CategoryType {
  ELECTRONICS = 'ELECTRONICS',
  FURNITURE = 'FURNITURE',
  CLOTHES = 'CLOTHES',
  BOOKS = 'BOOKS',
  GROCERY = 'GROCERY',
  TOYS = 'TOYS',
  BEAUTY = 'BEAUTY'
}

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  urlName: string;

  @IsOptional()
  @IsString()
  picture?: string;

  @IsNumber()
  price: number;

  @IsOptional()
  @IsNumber()
  discountPercentage?: number;

  @IsNumber()
  stock: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsArray()
  @IsEnum(CategoryType, { each: true })
  categories: CategoryType[];
}
