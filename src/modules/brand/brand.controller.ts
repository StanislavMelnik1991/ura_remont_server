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
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { BrandService } from './brand.service';
import { Roles } from 'decorators/roles.decorator';
import { RolesEnum } from 'shared/constants';
import { RolesGuard } from 'guards';
import {
  BrandSwaggerSchema,
  CreateBrandDto,
  GetAllBrandsDto,
} from 'types/swagger';
import { adminRouter } from 'shared/router';
import { ZodValidationPipe } from 'pipes/zodValidation.pipe';
import { FileInterceptor } from '@nestjs/platform-express';
import { ONE_MB_IN_BYTES } from 'shared/constants';
import { brandCreateScheme, brandGetAllScheme } from 'shared/schemas';

const { create, getAll, getOne, uploadImage } = adminRouter.brand;

@ApiTags('Admins commands', 'Brand')
@Roles(RolesEnum.ADMIN)
@UseGuards(RolesGuard)
@ApiBearerAuth()
@Controller()
export class BrandController {
  constructor(private service: BrandService) {}

  @ApiOperation({
    summary: 'Create brand',
    description: 'Creation new brand',
  })
  @ApiResponse({ status: 200, type: BrandSwaggerSchema })
  @Post(create.route)
  @UsePipes(new ZodValidationPipe(brandCreateScheme))
  create(@Body() data: CreateBrandDto): Promise<BrandSwaggerSchema> {
    return this.service.create(data);
  }

  @ApiOperation({
    summary: 'Get all brands',
    description: 'Get all brands with dictionaries',
  })
  @ApiResponse({ status: 200 })
  @Get(getAll.route)
  @UsePipes(new ZodValidationPipe(brandGetAllScheme))
  getAll(@Query() data: GetAllBrandsDto) {
    return this.service.getAllBrands(data);
  }

  @ApiOperation({
    summary: 'Get brand',
    description: 'Get brand',
  })
  @ApiResponse({ status: 200, type: BrandSwaggerSchema })
  @Get(getOne.route)
  getBrand(
    @Param(getOne.mask, ParseIntPipe) id: number,
  ): Promise<BrandSwaggerSchema> {
    return this.service.getBrand(id);
  }

  @ApiOperation({
    summary: 'Upload image',
    description: 'Upload type image',
  })
  @ApiResponse({ status: 200 })
  @Post(uploadImage.route)
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { files: 1, fileSize: 4 * ONE_MB_IN_BYTES },
    }),
  )
  uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Param(uploadImage.mask, ParseIntPipe) id: number,
  ) {
    return this.service.uploadImage({ data: file.buffer, id });
  }
}
