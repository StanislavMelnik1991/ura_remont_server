import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { TypeService } from './type.service';
import { RolesGuard } from 'guards';
import { Roles } from 'decorators/roles.decorator';
import { RolesEnum } from 'shared/constants';
import {
  AdminTypeSwaggerSchema,
  CreateTypeDto,
  GetAllTypeSDto,
  TypeSwaggerScheme,
} from 'types/swagger';
import { adminRouter } from 'shared/routes';
import { ZodValidationPipe } from 'pipes/zodValidation.pipe';

const {
  create,
  getAll: { baseRoute: getAllRoute, scheme: getAllScheme },
  current: {
    getCurrent: { baseRoute },
    idMask,
  },
} = adminRouter.type;

@ApiTags('Admins commands', 'Type')
@Roles(RolesEnum.ADMIN)
@UseGuards(RolesGuard)
@ApiBearerAuth()
@Controller()
export class TypeController {
  constructor(private service: TypeService) {}

  @ApiOperation({
    summary: 'Create type',
    description: 'Creation new type',
  })
  @ApiResponse({ status: 200, type: TypeSwaggerScheme })
  @Post(create.baseRoute)
  @UsePipes(new ZodValidationPipe(create.scheme))
  create(@Body() data: CreateTypeDto): Promise<TypeSwaggerScheme> {
    return this.service.create(data);
  }

  @ApiOperation({
    summary: 'Get all types',
    description: 'Get all types with dictionaries',
  })
  @ApiResponse({ status: 200, type: [AdminTypeSwaggerSchema] })
  @Get(getAllRoute)
  @UsePipes(new ZodValidationPipe(getAllScheme))
  getAll(@Query() data: GetAllTypeSDto) {
    return this.service.getAllTypes(data);
  }

  @ApiOperation({
    summary: 'Get type',
    description: 'Get type',
  })
  @ApiResponse({ status: 200, type: AdminTypeSwaggerSchema })
  @Get(baseRoute)
  getType(
    @Param(idMask, ParseIntPipe) id: number,
  ): Promise<AdminTypeSwaggerSchema> {
    return this.service.getType(id);
  }
}
