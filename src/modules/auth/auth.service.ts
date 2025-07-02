import {Injectable, UnauthorizedException} from '@nestjs/common';
import {EventEmitter2} from "@nestjs/event-emitter";
import {DataSource, Like} from "typeorm";
import {processData} from "../../utils/utils";
import * as argon2 from 'argon2'
import {AuthLoginDTO} from "./auth.entity";
import {User} from "../../schemas/user.schema";
import {v4 as uuidv4} from 'uuid'
import {CryptoService} from "../../services/crypto.service";
import {JwtService} from "@nestjs/jwt";
import {RedisService} from "../../messanger/redis/redis.service";

@Injectable()
export class AuthService {

    constructor(private readonly dataSourceRepository:DataSource,
                private readonly cryptoService: CryptoService,
                private readonly jwtService: JwtService,
                private readonly redisService: RedisService,) {}

    async createUser(user:any){
        const result = await this.dataSourceRepository.query(
            'CALL create_user(?,?,?,?,?)',
            [user?.username, user?.contactNumber, user?.email, await argon2.hash(user?.password), user?.role]
        )

        return processData(result,1);
    }

    async findByUsername(userName: string) {
        const user = await User.findOneBy({
            username: Like(`${userName}%`),
        })
        return user
    }

    async validatePassword(password, userPassword): Promise<boolean> {
        return await argon2.verify(userPassword, password);
    }

    async validateUser(authLoginDTO: AuthLoginDTO) {
        const {username, password} = authLoginDTO;

        if (!username || !password) {
            throw new UnauthorizedException('Username and password are required');
        }
        const user = await this.findByUsername(username);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }
        const isValidPassword = await this.validatePassword(password, user?.password);

        if (!isValidPassword) {
            throw new UnauthorizedException('Invalid credentials');
        }
        return user;
    }

    private async generateAuthResponse(user: User) {

        const payload = {
            userId: user.id,
            name: user.username,
        }

        let key = uuidv4()
        let encryptedKey = this.cryptoService.encrypt(key)
        let accessToken = this.jwtService.sign(payload)
        let refreshToken = this.jwtService.sign(payload, {expiresIn: '7d'})

        await this.redisService.saveToRedisWithExpiry(0, 'auth', key, payload)

        return {
            userName: user.username,
            authKey: encryptedKey,
            accessToken: this.cryptoService.encrypt(accessToken),
            refreshToken: this.cryptoService.encrypt(refreshToken)
        }
    }

    async login(authLoginDTO: AuthLoginDTO) {
        const user = await this.validateUser(authLoginDTO);
        return await this.generateAuthResponse(user);
    }
}
