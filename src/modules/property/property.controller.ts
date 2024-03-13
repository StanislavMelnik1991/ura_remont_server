import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PropertyService } from './property.service';

@ApiTags('Auth')
@Controller('api/:locale')
export class PropertyController {
  constructor(private authService: PropertyService) {}
}
