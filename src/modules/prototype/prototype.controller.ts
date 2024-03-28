import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
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
  fileSchema,
} from 'types/swagger';
import { adminRouter } from 'shared/router';
import { ZodValidationPipe } from 'pipes/zodValidation.pipe';
import { FileInterceptor } from '@nestjs/platform-express';
import { ONE_MB_IN_BYTES } from 'shared/constants';
import { propertyCreateScheme, prototypeCreateScheme } from 'shared/schemas';
import { IUser } from 'shared/types';

const { create, getOne, uploadImage, deleteOne } = adminRouter.prototype;
const { createProperty, getAll } = adminRouter.property;

@ApiTags('Admins commands', 'Prototype')
@ApiBearerAuth()
@Controller()
export class PrototypeController {
  constructor(private service: PrototypeService) {}

  @ApiOperation({
    summary: 'Create prototype',
    description: 'Creation new type of production',
  })
  @ApiResponse({ status: 200 })
  @Post(create.route)
  @Roles(RolesEnum.ADMIN)
  @UseGuards(RolesGuard)
  @UsePipes(new ZodValidationPipe(prototypeCreateScheme))
  create(@Body() data: CreatePrototypeDto, @Req() { user }: { user: IUser }) {
    return this.service.create({ ...data, user });
  }

  @ApiOperation({
    summary: 'Get prototype',
    description: 'Get prototype',
  })
  @ApiResponse({ status: 200, type: PrototypeSwaggerScheme })
  @Get(getOne.route)
  getPrototype(
    @Param(getOne.mask, ParseIntPipe) id: number,
  ): Promise<PrototypeSwaggerScheme | null> {
    return this.service.getPrototype(id);
  }

  @ApiOperation({
    summary: 'Get prototype properties',
    description: 'Get prototype properties',
  })
  @ApiResponse({ status: 200, type: [PrototypeSwaggerScheme] })
  @ApiTags('Properties')
  @Get(getAll.route)
  getProperties(
    @Param(getAll.mask, ParseIntPipe) id: number,
  ): Promise<PrototypeProperty[]> {
    return this.service.getProperties(id);
  }

  @ApiOperation({
    summary: 'Create prototype property',
    description: 'Create prototype property',
  })
  @ApiResponse({ status: 200 })
  @ApiTags('Properties')
  @Post(createProperty.route)
  @Roles(RolesEnum.ADMIN)
  @UseGuards(RolesGuard)
  @UsePipes(new ZodValidationPipe(propertyCreateScheme))
  createProperty(
    @Body() data: CreatePropertyDto,
    @Req() { user }: { user: IUser },
  ) {
    return this.service.createProperty({ ...data, user });
  }

  @ApiOperation({
    summary: 'Upload image',
    description: 'Upload prototype image',
  })
  @ApiResponse({ status: 200 })
  @ApiConsumes('multipart/form-data')
  @ApiBody(fileSchema)
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

  @ApiOperation({
    summary: 'Delete prototype',
  })
  @ApiResponse({ status: 200 })
  @Delete(deleteOne.route)
  @Roles(RolesEnum.ADMIN)
  @UseGuards(RolesGuard)
  deleteBrand(
    @Param(deleteOne.mask, ParseIntPipe) id: number,
    @Req() { user }: { user: IUser },
  ) {
    return this.service.deletePrototype({ id, userId: user.id });
  }
}
