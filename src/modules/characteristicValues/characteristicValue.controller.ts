import {
  Body,
  Controller,
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
import { CharacteristicValueService } from './characteristicValue.service';
import { CreateTypePropertyValueDto, IdOnlyResponse } from 'shared/schemas';
import { RolesEnum } from 'shared/constants';
import { Roles } from 'decorators/roles.decorator';
import { RolesGuard } from 'guards';

@ApiTags('Admins commands', 'CharacteristicValues')
@Roles(RolesEnum.ADMIN)
@UseGuards(RolesGuard)
@ApiBearerAuth()
@Controller('api/admin/prototype/:prototypeId')
export class CharacteristicValueController {
  constructor(private service: CharacteristicValueService) {}

  @ApiOperation({
    summary: 'Create prototype property',
    description: 'Create prototype property',
  })
  @ApiResponse({ status: 200, type: IdOnlyResponse })
  @Post('/property/:characteristicId/')
  createValue(
    @Body() { value }: CreateTypePropertyValueDto,
    @Param('prototypeId', ParseIntPipe) prototypeId: number,
    @Param('characteristicId', ParseIntPipe) characteristicId: number,
  ): Promise<IdOnlyResponse> {
    return this.service.setValue({ value, characteristicId, prototypeId });
  }
}
