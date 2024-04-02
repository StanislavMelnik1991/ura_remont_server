import {
  Body,
  Controller,
  Delete,
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
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { BrandService } from './brand.service';
import { Roles } from 'decorators/roles.decorator';
import { RolesEnum } from 'shared/constants';
import { RolesGuard } from 'guards';
import {
  BrandFullSwaggerSchema,
  BrandSwaggerSchema,
  CreateBrandDto,
  GetAllBrandsDto,
  GetManyBrandsSwaggerScheme,
  fileSchema,
} from 'types/swagger';
import { adminRouter } from 'shared/router';
import { ZodValidationPipe } from 'pipes/zodValidation.pipe';
import { FileInterceptor } from '@nestjs/platform-express';
import { ONE_MB_IN_BYTES } from 'shared/constants';
import { brandCreateScheme, brandGetAllScheme } from 'shared/schemas';
import { IUser } from 'shared/types';

const { create, getAll, getOne, uploadImage, deleteOne } = adminRouter.brand;

@ApiTags('Admins commands', 'Brand')
@ApiBearerAuth()
@Controller()
export class BrandController {
  constructor(private service: BrandService) {}

  @ApiOperation({
    summary: 'Create brand',
    description: 'Creation new brand',
  })
  @ApiResponse({ status: 200, type: BrandFullSwaggerSchema })
  @Post(create.route)
  @Roles(RolesEnum.ADMIN)
  @UseGuards(RolesGuard)
  @UsePipes(new ZodValidationPipe(brandCreateScheme))
  create(
    @Body() data: CreateBrandDto,
    @Req() { user }: { user: IUser },
  ): Promise<BrandSwaggerSchema> {
    return this.service.create({ ...data, user });
  }

  @ApiOperation({
    summary: 'Get all brands',
    description: 'Get all brands with dictionaries',
  })
  @ApiResponse({ status: 200, type: GetManyBrandsSwaggerScheme })
  @Get(getAll.route)
  @UsePipes(new ZodValidationPipe(brandGetAllScheme))
  getAll(@Query() data: GetAllBrandsDto) {
    return this.service.getAllBrands(data);
  }

  @ApiOperation({
    summary: 'Get brand',
  })
  @ApiResponse({ status: 200, type: BrandFullSwaggerSchema })
  @Get(getOne.route)
  getBrand(
    @Param(getOne.mask, ParseIntPipe) id: number,
  ): Promise<BrandSwaggerSchema> {
    return this.service.getBrand(id);
  }

  @ApiOperation({
    summary: 'Delete brand',
  })
  @ApiResponse({ status: 200, type: BrandFullSwaggerSchema })
  @Delete(deleteOne.route)
  @Roles(RolesEnum.ADMIN)
  @UseGuards(RolesGuard)
  deleteBrand(
    @Param(deleteOne.mask, ParseIntPipe) id: number,
    @Req() { user }: { user: IUser },
  ) {
    return this.service.deleteBrand({ id, userId: user.id });
  }

  @ApiOperation({
    summary: 'Upload image',
    description: 'Upload type image',
  })
  @ApiResponse({ status: 200 })
  @Post(uploadImage.route)
  @ApiConsumes('multipart/form-data')
  @ApiBody(fileSchema)
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
