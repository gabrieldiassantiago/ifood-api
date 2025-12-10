import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service'; 
import { StorageService } from '../storage/storage.service';
import { CreateProductDto } from './dtos/createProduct';


@Injectable()
export class MenuService {
    constructor(private prisma: PrismaService, private storageService: StorageService) {}

    async createProduct(data: CreateProductDto, files?: Express.Multer.File[]) {

    const categoryExists = await this.prisma.category.findUnique({
        where: { id: data.categoryId },
    })

    if (!categoryExists) {
        throw new NotFoundException(`Categoria com ID ${data.categoryId} não encontrada.`);
    }

    const imageUrls: string[] = [];

    if (files && files.length > 0) {
       try {
        const uploadPromises = files.map(file => this.storageService.uploadFile(file));
        const uploadedUrls = await Promise.all(uploadPromises);
        imageUrls.push(...uploadedUrls);
       } catch (error) {
       
       throw new BadRequestException('Erro ao carregar imagens: ' + error.message);
       }
    }
    
        const product = await this.prisma.product.create({
            data: {
                name: data.name,
                description: data.description,
                price: data.price,
                images: {
                    create: imageUrls.map((url, index) => ({
                        imageUrl: url,
                        order: index,
                        isPrimary: index === 0 
                    }))
                },
                categoryId: data.categoryId,
                isActive: data.isActive ?? true,
                stockQuantity: data.stockQuantity ?? 0
            },

        })

        return product;
    }

    async createCategory(name: string, file?: Express.Multer.File) {

        let imageUrl = '';

        if (file) {
            imageUrl = await this.storageService.uploadFile(file);
        }

        const category = await this.prisma.category.create({
            data: {
                name,
                imageUrl
            }
        })
        return category;
    }

    async getAllProducts() {

        const products = await this.prisma.product.findMany({
            include: {
                images: true
            }
        });

        return products;
        
    }

}