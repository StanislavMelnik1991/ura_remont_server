import { Body, Controller, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CharacteristicValueService } from './characteristicValue.service';
import { CreateTypePropertyValueDto, IdOnlyResponse } from 'shared/schemas';

@ApiTags('Admins commands', 'CharacteristicValues')
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
    return this.service.createValue({ value, characteristicId, prototypeId });
  }
}
