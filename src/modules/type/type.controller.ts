import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
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
  TypeSwaggerScheme,
  CreateTypeDto,
  GetAllTypeSDto,
} from 'types/swagger';
import { adminRouter } from 'shared/routes';
import { ZodValidationPipe } from 'pipes/zodValidation.pipe';
import { FileInterceptor } from '@nestjs/platform-express';
import { ONE_MB_IN_BYTES } from 'shared/constants/file.constants';

const {
  create,
  getAll: { baseRoute: getAllRoute, scheme: getAllScheme },
  current: {
    getCurrent: { baseRoute: getCurrentRoute },
    upload: { baseRoute: uploadRoute },
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
  @ApiResponse({ status: 200, type: [TypeSwaggerScheme] })
  @Get(getAllRoute)
  @UsePipes(new ZodValidationPipe(getAllScheme))
  getAll(@Query() data: GetAllTypeSDto) {
    return this.service.getAllTypes(data);
  }

  @ApiOperation({
    summary: 'Get type',
    description: 'Get type',
  })
  @ApiResponse({ status: 200, type: TypeSwaggerScheme })
  @Get(getCurrentRoute)
  getType(@Param(idMask, ParseIntPipe) id: number): Promise<TypeSwaggerScheme> {
    return this.service.getType(id);
  }

  @ApiOperation({
    summary: 'Upload image',
    description: 'Upload type image',
  })
  @ApiResponse({ status: 200 })
  @Post(uploadRoute)
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { files: 1, fileSize: 4 * ONE_MB_IN_BYTES },
    }),
  )
  uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Param(idMask, ParseIntPipe) id: number,
  ) {
    return this.service.uploadImage({ data: file.buffer, id });
  }
}
