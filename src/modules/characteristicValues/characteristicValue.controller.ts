import { Body, Controller, Post, UseGuards, UsePipes } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CharacteristicValueService } from './characteristicValue.service';
import { RolesEnum } from 'shared/constants';
import { Roles } from 'decorators/roles.decorator';
import { RolesGuard } from 'guards';
import { CreateCharacteristicValueDto } from 'types/swagger';
import { adminRouter } from 'shared/router';
import { ZodValidationPipe } from 'pipes/zodValidation.pipe';
import { characteristicValueCreateScheme } from 'shared/schemas';

const { create } = adminRouter.characteristicValues;

@ApiTags('Admins commands', 'Characteristics', 'Prototype')
@Roles(RolesEnum.ADMIN)
@UseGuards(RolesGuard)
@ApiBearerAuth()
@Controller()
export class CharacteristicValueController {
  constructor(private service: CharacteristicValueService) {}

  @ApiOperation({
    summary: 'Create characteristic value',
    description: 'Create characteristic value',
  })
  @ApiResponse({ status: 200 })
  @Post(create.route)
  @UsePipes(new ZodValidationPipe(characteristicValueCreateScheme))
  createValue(@Body() data: CreateCharacteristicValueDto) {
    return this.service.setValue(data);
  }
}
