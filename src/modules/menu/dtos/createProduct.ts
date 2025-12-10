import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
export class CreateProductDto {
   @IsNotEmpty()
   @IsString()
   name: string;

   @IsString()
   description?: string;

   @IsNotEmpty()
   @IsNumber()
   price: number;

   @IsString()
   imageUrl?: string;

   @IsNotEmpty()
   @IsNumber()
   categoryId: number;

   @IsNotEmpty()
   isActive?: boolean;

   @IsNumber()
   stockQuantity?: number;
}