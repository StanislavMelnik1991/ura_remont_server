import {
  Body,
  Controller,
  Get,
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
import { CharacteristicService } from './characteristic.service';
import { Characteristic } from 'database';
import { Roles } from 'decorators/roles.decorator';
import { RolesGuard } from 'guards';
import { RolesEnum } from 'shared/constants';
import { CharacteristicSwaggerScheme, CreatePropertyDto } from 'types/swagger';
import { adminRouter } from 'shared/routes';
import { ZodValidationPipe } from 'pipes/zodValidation.pipe';

const {
  create: {
    typeIdMask: createIdMask,
    baseRoute: createRoute,
    scheme: createScheme,
  },
  getAll: { typeIdMask: getIdMask, baseRoute: getAllRoute },
} = adminRouter.type.current.characteristic;

@ApiTags('Admins commands', 'Characteristics')
@Roles(RolesEnum.ADMIN)
@UseGuards(RolesGuard)
@ApiBearerAuth()
@Controller()
export class CharacteristicController {
  constructor(private service: CharacteristicService) {}

  @ApiOperation({
    summary: 'Get characteristics for type',
    description: 'Get characteristics for type',
  })
  @ApiResponse({ status: 200, type: [CharacteristicSwaggerScheme] })
  @Get(getAllRoute)
  getCharacteristics(
    @Param(getIdMask, ParseIntPipe) id: number,
  ): Promise<Characteristic[]> {
    return this.service.findById(id);
  }

  @ApiOperation({
    summary: 'Create type characteristic',
    description: 'Create type characteristic',
  })
  @ApiResponse({ status: 200 })
  @Post(createRoute)
  @UsePipes(new ZodValidationPipe(createScheme))
  createCharacteristic(
    @Body() data: CreatePropertyDto,
    @Param(createIdMask, ParseIntPipe) typeId: number,
  ) {
    return this.service.create({ ...data, typeId });
  }
}
