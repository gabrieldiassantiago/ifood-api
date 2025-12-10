import { 
  Controller, 
  Post, 
  Body, 
  UseInterceptors, 
  UploadedFile, 
  ParseFilePipe, 
  MaxFileSizeValidator, 
  FileTypeValidator, 
  Get,
  UploadedFiles
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { MenuService } from './menu.service';
import { StorageService } from '../storage/storage.service';
import { CreateProductDto } from './dtos/createProduct';

@Controller('menu')
export class MenuController {
  constructor(
    private readonly menuService: MenuService,
    private readonly storageService: StorageService
  ) {}

  @Post('categories')
  @UseInterceptors(FileInterceptor('file'))
  async createCategory(
    @Body('name') name: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }), // 5MB
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
        ],
        fileIsRequired: false,
      }),
    ) file?: Express.Multer.File,
  ) 
  {
    console.time('Total');
    const result = await this.menuService.createCategory(name, file);
    console.timeEnd('Total');
    return result;
  }

  @Post('products')
  @UseInterceptors(FilesInterceptor('files', 10)) // Permite até 10 arquivos
  async createProduct(
    @Body() body: any, 
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }), // 5MB
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
        ],
        fileIsRequired: false,
      }),
    ) files?: Express.Multer.File[],
  ) {
    const dto: CreateProductDto = {
      name: body.name,
      description: body.description,
      price: Number(body.price),
      categoryId: Number(body.categoryId),
      isActive: body.isActive === 'true',
    };

    return this.menuService.createProduct(dto, files);
  }

  @Get('products')
  async getAllProducts() {
    return this.menuService.getAllProducts();
  }
}