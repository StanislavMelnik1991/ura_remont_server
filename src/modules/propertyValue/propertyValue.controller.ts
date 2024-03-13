import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PropertyValueService } from './propertyValue.service';

@ApiTags('Auth')
@Controller('api/:locale')
export class PropertyValueController {
  constructor(private authService: PropertyValueService) {}
}
