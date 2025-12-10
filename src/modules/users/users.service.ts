import { PrismaService } from "src/prisma/prisma.service";
import { CreateUserDto } from "./dtos/create-user.dto";
import { UserRole } from "./dtos/user-role.dto";
import * as bcrypt from 'bcrypt';
import { ConflictException, HttpStatus, Injectable } from "@nestjs/common";

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService, 
        
    ) {}

    async createUser(data: CreateUserDto) {

        if (data.role === UserRole.CUSTOMER && !data.phone) {
            throw new ConflictException({
                statusCode: HttpStatus.CONFLICT,
                message: 'Clientes devem fornecer um número de telefone.'
            });
        }

        if ([UserRole.ADMIN, UserRole.MANAGER, UserRole.KITCHEN,UserRole.DRIVER].includes(data.role) && !data.email) {
            throw new ConflictException({
                statusCode: HttpStatus.CONFLICT,
                message: 'Usuários com função administrativa devem fornecer um e-mail.'
            });
        }

        if (data.email) {
            const emailExists = await this.prisma.user.findUnique({
                where: {email: data.email}
            })

            if (emailExists) {
                throw new ConflictException({
                    statusCode: HttpStatus.CONFLICT,
                    message: 'E-mail já está em uso.'
                });
            }
        }
        if (data.phone) {
            const phoneExists = await this.prisma.user.findUnique({
                where: {phone: data.phone}
            })
            if (phoneExists) {
                throw new ConflictException({
                    statusCode: HttpStatus.CONFLICT,
                    message: 'Número de telefone já está em uso.'
                });
            }
        }

        const saltRounds = 10;

        const hashPassoword = await bcrypt.hash(data.password, saltRounds);
        
        const user = await this.prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                phone: data.phone,
                password: hashPassoword,
                role: data.role
            }
        })
        return user;
    }
}