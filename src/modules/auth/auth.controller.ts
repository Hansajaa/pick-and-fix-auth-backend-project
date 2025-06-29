import {Body, Controller, Post} from '@nestjs/common';
import {AuthService} from "./auth.service";

@Controller()
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('create-user')
    async createUser(@Body() body:any){
        return await this.authService.createUser(body);
    }


}
