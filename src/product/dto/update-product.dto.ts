import { IsString, IsNumber, IsOptional, IsArray, IsEnum, Min, Max, ArrayMinSize } from 'class-validator';

export class UpdateProductDto {
  @IsString()
  productId : string;

  @IsString()
  name?: string;

  @IsString()
  urlName?: string;

  @IsOptional()
  @IsString()
  picture?: string;

  @IsNumber()
  price?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  discountPercentage?: number;

  @IsNumber()
  stock?: number;

  @IsOptional()
  @IsString()
  description?: string;

}
