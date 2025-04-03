import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@Controller('users')
export class UsersController {

    @Get()
    @ApiOperation({ summary: 'Get a list of users' }) 
    getUsers() {
        return [{ name: 'John Doe' }, { name: 'Jane Doe' }];
    }
}
