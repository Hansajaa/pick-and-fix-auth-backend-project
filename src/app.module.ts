import {Module} from '@nestjs/common'
import {AppController} from './app.controller'
import {AppService} from './app.service'
import {ConfigModule} from '@nestjs/config'
import {APP_INTERCEPTOR, RouterModule} from '@nestjs/core'
import {routes} from '../routes'
import {TypeOrmModule} from '@nestjs/typeorm'
import {dataSourceOptions} from './config/typeorm.config'
import {ResponseInterceptor} from './interceptor/response.interceptor'
import {RequestInterceptor} from './interceptor/request.interceptor'

import redisConfig from "./config/redis.config";
import {RedisModule} from "./messanger/redis/redis.module";
import {EventEmitterModule} from "@nestjs/event-emitter";
import { AuthModule } from './modules/auth/auth.module';



@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: `.env`,
            isGlobal: true,
            load: [redisConfig],
        }),
        TypeOrmModule.forRoot(dataSourceOptions),
        RouterModule.register(routes),
        EventEmitterModule.forRoot(),
        RedisModule,
        AuthModule,

    ],
    controllers: [AppController],
    providers: [
        AppService,
        {
            provide: APP_INTERCEPTOR,
            useClass: ResponseInterceptor,
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: RequestInterceptor,
        },
    ],
})
export class AppModule {
}
