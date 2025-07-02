import {Body, Controller, Post} from '@nestjs/common';
import {AuthService} from "./auth.service";
import {AuthLoginDTO} from "./auth.entity";

@Controller()
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('create-user')
    async createUser(@Body() body:any){
        return await this.authService.createUser(body);
    }

    @Post('/login')
    async login(@Body() authLoginDto: AuthLoginDTO) {
        return this.authService.login(authLoginDto);
    }
}
