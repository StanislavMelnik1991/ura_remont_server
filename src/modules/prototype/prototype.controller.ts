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
import { PrototypeService } from './prototype.service';
import { PrototypeProperty } from 'database';
import { Roles } from 'decorators/roles.decorator';
import { RolesEnum } from 'shared/constants';
import { RolesGuard } from 'guards';
import {
  CreatePrototypeDto,
  PrototypeSwaggerScheme,
  CreatePropertyDto,
} from 'types/swagger';
import { adminRouter } from 'shared/routes';
import { ZodValidationPipe } from 'pipes/zodValidation.pipe';

const {
  create: { baseRoute: createRoute, scheme: createScheme },
  current: {
    getCurrent: { baseRoute: currentRoute },
    idMask: currentMask,
    property: {
      create: { baseRoute: createPropertyRoute, scheme: createPropertyScheme },
      getAll: { baseRoute: getPropertyRoute },
    },
  },
} = adminRouter.prototype;

@ApiTags('Admins commands', 'Prototype')
@Roles(RolesEnum.ADMIN)
@UseGuards(RolesGuard)
@ApiBearerAuth()
@Controller()
export class PrototypeController {
  constructor(private service: PrototypeService) {}

  @ApiOperation({
    summary: 'Create prototype',
    description: 'Creation new type of production',
  })
  @ApiResponse({ status: 200 })
  @Post(createRoute)
  @UsePipes(new ZodValidationPipe(createScheme))
  create(@Body() data: CreatePrototypeDto) {
    return this.service.create(data);
  }

  @ApiOperation({
    summary: 'Get prototype',
    description: 'Get prototype',
  })
  @ApiResponse({ status: 200, type: PrototypeSwaggerScheme })
  @Get(currentRoute)
  getPrototype(
    @Param(currentMask, ParseIntPipe) id: number,
  ): Promise<PrototypeSwaggerScheme | null> {
    return this.service.getPrototype(id);
  }

  @ApiOperation({
    summary: 'Get prototype properties',
    description: 'Get prototype properties',
  })
  @ApiResponse({ status: 200, type: [PrototypeSwaggerScheme] })
  @ApiTags('Properties')
  @Get(getPropertyRoute)
  getProperties(
    @Param(currentMask, ParseIntPipe) id: number,
  ): Promise<PrototypeProperty[]> {
    return this.service.getProperties(id);
  }

  @ApiOperation({
    summary: 'Create prototype property',
    description: 'Create prototype property',
  })
  @ApiResponse({ status: 200 })
  @ApiTags('Properties')
  @Post(createPropertyRoute)
  @UsePipes(new ZodValidationPipe(createPropertyScheme))
  createProperty(
    @Body() data: CreatePropertyDto,
    @Param(currentMask, ParseIntPipe) id: number,
  ) {
    return this.service.createProperty({ ...data, prototypeId: id });
  }
}
