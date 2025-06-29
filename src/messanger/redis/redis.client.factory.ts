import {ConfigService} from '@nestjs/config';
import {Redis} from 'ioredis';

export const redisProviders = [
  {
    provide: 'REDIS_CACHE_CLIENT',
    useFactory: (configService: ConfigService): Redis => {
      const opts = configService.get('redisCache')
      return new Redis(opts)
    },
    inject: [ConfigService],
  },
  {
    provide: 'REDIS_PUBSUB_CLIENT',
    useFactory: (configService: ConfigService): Redis => {
      const opts = configService.get('redisPubSub')
      return new Redis(opts)
    },
    inject: [ConfigService],
  },
]

