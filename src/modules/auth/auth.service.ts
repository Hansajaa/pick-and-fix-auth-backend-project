import { Injectable } from '@nestjs/common';
import {EventEmitter2} from "@nestjs/event-emitter";
import {DataSource} from "typeorm";
import {processData} from "../../utils/utils";
import * as argon2 from 'argon2'

@Injectable()
export class AuthService {

    constructor(private readonly dataSourceRepository:DataSource) {}

    async createUser(user:any){
        const result = await this.dataSourceRepository.query(
            'CALL create_user(?,?,?,?)',
            [user?.username, user?.contactNumber, user?.email, await argon2.hash(user?.password)]
        )

        return processData(result,1);
    }
}
