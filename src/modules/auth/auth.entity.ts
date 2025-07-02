import {IsNotEmpty, IsString} from "class-validator";

export class AuthLoginDTO {
    @IsString()
    @IsNotEmpty()
    username: string
    @IsNotEmpty()
    password: string
}