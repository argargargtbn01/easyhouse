import { Module } from '@nestjs/common';
import { HouseController } from './house.controller';
import { HouseService } from './house.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { House } from './entities/house.entity';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([House]), UserModule],
  controllers: [HouseController],
  providers: [HouseService],
})
export class HouseModule {}
