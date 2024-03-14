import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CharacteristicService } from './characteristic.service';
import { Characteristic } from 'database';
import { CreateTypePropertyDto, IdOnlyResponse } from 'shared/schemas';

@ApiTags('Admins commands', 'Characteristics')
@Controller('api/admin/type/:typeId/characteristics')
export class CharacteristicController {
  constructor(private service: CharacteristicService) {}

  @ApiOperation({
    summary: 'Get characteristics for type',
    description: 'Get characteristics for type',
  })
  @ApiResponse({ status: 200, type: [Characteristic] })
  @Get('/')
  getCharacteristics(
    @Param('typeId', ParseIntPipe) typeId: number,
  ): Promise<Characteristic[]> {
    return this.service.findById(typeId);
  }

  @ApiOperation({
    summary: 'Create type characteristic',
    description: 'Create type characteristic',
  })
  @ApiResponse({ status: 200, type: IdOnlyResponse })
  @Post('/')
  createCharacteristic(
    @Body() data: CreateTypePropertyDto,
    @Param('typeId', ParseIntPipe) typeId: number,
  ): Promise<IdOnlyResponse> {
    return this.service.create({ ...data, typeId });
  }
}
