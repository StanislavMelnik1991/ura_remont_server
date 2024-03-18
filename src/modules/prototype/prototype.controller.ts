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
import { PrototypeService } from './prototype.service';
import { PrototypeProperty } from 'database';
import { Roles } from 'decorators/roles.decorator';
import { RolesEnum } from 'shared/constants';
import { RolesGuard } from 'guards';
import { CreatePrototypeDto } from 'utils/swagger/dto/prototype.dto';
import { PrototypeSwaggerScheme } from 'utils/swagger';
import { CreatePropertyDto } from 'utils/swagger/dto/property.dto';

@ApiTags('Admins commands', 'Prototype')
@Roles(RolesEnum.ADMIN)
@UseGuards(RolesGuard)
@ApiBearerAuth()
@Controller('api/admin/prototype')
export class PrototypeController {
  constructor(private service: PrototypeService) {}

  @ApiOperation({
    summary: 'Create prototype',
    description: 'Creation new type of production',
  })
  @ApiResponse({ status: 200 })
  @Post('/')
  create(@Body() data: CreatePrototypeDto) {
    return this.service.create(data);
  }

  /* @ApiOperation({
    summary: 'Update prototype',
    description: 'Update prototype values',
  })
  @ApiResponse({ status: 200 })
  @Patch('/:id')
  update(
    @Body() data: UpdatePrototypeDto,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<IdOnlyResponse> {
    return this.service.update({ ...data, id });
  } */

  @ApiOperation({
    summary: 'Get prototype',
    description: 'Get prototype',
  })
  @ApiResponse({ status: 200, type: PrototypeSwaggerScheme })
  @Get('/:id')
  getType(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<PrototypeSwaggerScheme | null> {
    return this.service.getPrototype(id);
  }

  @ApiOperation({
    summary: 'Get prototype properties',
    description: 'Get prototype properties',
  })
  @ApiResponse({ status: 200, type: [PrototypeSwaggerScheme] })
  @Get('/:id/properties')
  getProperties(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<PrototypeProperty[]> {
    return this.service.getProperties(id);
  }

  @ApiOperation({
    summary: 'Create prototype property',
    description: 'Create prototype property',
  })
  @ApiResponse({ status: 200 })
  @Post('/:id/property')
  createProperty(
    @Body() data: CreatePropertyDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.service.createProperty({ ...data, prototypeId: id });
  }
}
