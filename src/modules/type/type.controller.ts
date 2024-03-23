import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
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
import { adminRouter } from 'shared/router';
import { ZodValidationPipe } from 'pipes/zodValidation.pipe';
import { FileInterceptor } from '@nestjs/platform-express';
import { ONE_MB_IN_BYTES } from 'shared/constants';
import { typeCreateScheme, typeGetAllScheme } from 'shared/schemas';
import { IUser } from 'shared/types';

const { create, getAll, getOne, uploadImage } = adminRouter.type;

@ApiTags('Admins commands', 'Type')
@ApiBearerAuth()
@Controller()
export class TypeController {
  constructor(private service: TypeService) {}

  @ApiOperation({
    summary: 'Create type',
    description: 'Creation new type',
  })
  @ApiResponse({ status: 200, type: TypeSwaggerScheme })
  @Post(create.route)
  @Roles(RolesEnum.ADMIN)
  @UseGuards(RolesGuard)
  @UsePipes(new ZodValidationPipe(typeCreateScheme))
  create(
    @Body() data: CreateTypeDto,
    @Req() { user }: { user: IUser },
  ): Promise<TypeSwaggerScheme> {
    return this.service.create({ ...data, user });
  }

  @ApiOperation({
    summary: 'Get all types',
    description: 'Get all types with dictionaries',
  })
  @ApiResponse({ status: 200, type: [TypeSwaggerScheme] })
  @Get(getAll.route)
  @UsePipes(new ZodValidationPipe(typeGetAllScheme))
  getAll(@Query() data: GetAllTypeSDto) {
    return this.service.getAllTypes(data);
  }

  @ApiOperation({
    summary: 'Get type',
    description: 'Get type',
  })
  @ApiResponse({ status: 200, type: TypeSwaggerScheme })
  @Get(getOne.route)
  getType(
    @Param(getOne.mask, ParseIntPipe) id: number,
  ): Promise<TypeSwaggerScheme> {
    return this.service.getType(id);
  }

  @ApiOperation({
    summary: 'Upload image',
    description: 'Upload type image',
  })
  @ApiResponse({ status: 200 })
  @Post(uploadImage.route)
  @Roles(RolesEnum.ADMIN)
  @UseGuards(RolesGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { files: 1, fileSize: 4 * ONE_MB_IN_BYTES },
    }),
  )
  uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Param(uploadImage.mask, ParseIntPipe) id: number,
    @Req() { user }: { user: IUser },
  ) {
    return this.service.uploadImage({ data: file.buffer, id, user });
  }
}
