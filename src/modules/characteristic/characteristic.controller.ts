import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CharacteristicService } from './characteristic.service';
import { Characteristic } from 'database';
import { Roles } from 'decorators/roles.decorator';
import { RolesGuard } from 'guards';
import { RolesEnum } from 'shared/constants';
import { CreatePropertyDto } from 'types/swagger';

@ApiTags('Admins commands', 'Characteristics')
@Roles(RolesEnum.ADMIN)
@UseGuards(RolesGuard)
@ApiBearerAuth()
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
  @ApiResponse({ status: 200 })
  @Post('/')
  createCharacteristic(
    @Body() data: CreatePropertyDto,
    @Param('typeId', ParseIntPipe) typeId: number,
  ) {
    return this.service.create({ ...data, typeId });
  }
}
