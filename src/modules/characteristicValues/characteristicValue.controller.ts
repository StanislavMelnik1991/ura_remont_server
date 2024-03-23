import {
  Body,
  Controller,
  Post,
  Req,
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
import { CreateCharacteristicValueDto } from 'types/swagger';
import { adminRouter } from 'shared/router';
import { ZodValidationPipe } from 'pipes/zodValidation.pipe';
import { characteristicValueCreateScheme } from 'shared/schemas';
import { IUser } from 'shared/types';

const { create } = adminRouter.characteristicValues;

@ApiTags('Admins commands', 'Characteristics', 'Prototype')
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
  @Roles(RolesEnum.ADMIN)
  @UseGuards(RolesGuard)
  @UsePipes(new ZodValidationPipe(characteristicValueCreateScheme))
  createValue(
    @Body() data: CreateCharacteristicValueDto,
    @Req() { user }: { user: IUser },
  ) {
    return this.service.create({ ...data, user });
  }
}
