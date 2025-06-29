import {Module} from "@nestjs/common";
import {ConfigModule} from "@nestjs/config";
import {RedisService} from "./redis.service";
import {redisProviders} from "./redis.client.factory";
import {RedisRepository} from "./redis.repository";


@Module({
  imports: [ConfigModule],
  providers: [RedisService,...redisProviders,RedisRepository],
  exports: [RedisService],
})
export class RedisModule {}
