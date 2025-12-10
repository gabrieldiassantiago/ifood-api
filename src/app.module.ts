import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MenuController } from './modules/menu/menu.controller';
import { StorageService } from './modules/storage/storage.service';
import { MenuService } from './modules/menu/menu.service';
import { StorageModule } from './modules/storage/storage.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { MenuModule } from './modules/menu/menu.module';
import { UsersController } from './modules/users/users.controller';
import { UsersService } from './modules/users/users.service';

@Module({
  imports: [StorageModule, ConfigModule.forRoot({
    isGlobal: true,
  }), PrismaModule, MenuModule],
  controllers: [AppController, MenuController, UsersController],
  providers: [AppService, StorageService, MenuService, PrismaService, UsersService],
})
export class AppModule {}
