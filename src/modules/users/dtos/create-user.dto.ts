import { IsOptional, IsString, IsEnum, MinLength, isEmail, IsEmail } from "class-validator";
import { UserRole } from "./user-role.dto";

export class CreateUserDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsEnum(UserRole)
  role: UserRole;
}