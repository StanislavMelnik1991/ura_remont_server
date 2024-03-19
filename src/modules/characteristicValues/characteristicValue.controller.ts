import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
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
import { CreateValueDto } from 'types/swagger';
import { adminRouter } from 'shared/routes';
import { ZodValidationPipe } from 'pipes/zodValidation.pipe';

const {
  create: { baseRoute, scheme, prototypeIdMask, idMask },
} = adminRouter.prototype.current.value;

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
  @Post(baseRoute)
  @UsePipes(new ZodValidationPipe(scheme))
  createValue(
    @Body() { value }: CreateValueDto,
    @Param(prototypeIdMask, ParseIntPipe) prototypeId: number,
    @Param(idMask, ParseIntPipe) characteristicId: number,
  ) {
    return this.service.setValue({ value, characteristicId, prototypeId });
  }
}
