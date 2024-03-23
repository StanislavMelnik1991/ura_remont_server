import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
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
import { CharacteristicService } from './characteristic.service';
import { Characteristic } from 'database';
import { Roles } from 'decorators/roles.decorator';
import { RolesGuard } from 'guards';
import { RolesEnum } from 'shared/constants';
import {
  CharacteristicSwaggerScheme,
  CreateCharacteristicDto,
} from 'types/swagger';
import { adminRouter } from 'shared/router';
import { ZodValidationPipe } from 'pipes/zodValidation.pipe';
import { characteristicCreateScheme } from 'shared/schemas';
import { IUser } from 'shared/types';

const { create, getAllForType } = adminRouter.characteristic;

@ApiTags('Admins commands', 'Characteristics')
@ApiBearerAuth()
@Controller()
export class CharacteristicController {
  constructor(private service: CharacteristicService) {}

  @ApiOperation({
    summary: 'Get characteristics for type',
    description: 'Get characteristics for type',
  })
  @ApiResponse({ status: 200, type: [CharacteristicSwaggerScheme] })
  @Get(getAllForType.route)
  getCharacteristics(
    @Param(getAllForType.mask, ParseIntPipe) id: number,
  ): Promise<Characteristic[]> {
    return this.service.findById(id);
  }

  @ApiOperation({
    summary: 'Create type characteristic',
    description: 'Create type characteristic',
  })
  @ApiResponse({ status: 200 })
  @Roles(RolesEnum.ADMIN)
  @UseGuards(RolesGuard)
  @Post(create.route)
  @UsePipes(new ZodValidationPipe(characteristicCreateScheme))
  createCharacteristic(
    @Body() data: CreateCharacteristicDto,
    @Req() { user }: { user: IUser },
  ) {
    return this.service.create({ ...data, user });
  }
}
