import { ApiPropertyOptional } from '@nestjs/swagger';
import {  IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class getProductQueryDto  {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;
}
