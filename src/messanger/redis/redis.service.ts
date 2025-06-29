import {Inject, Injectable} from '@nestjs/common';
import {RedisRepository} from './redis.repository';

@Injectable()
export class RedisService {

  constructor(
    @Inject(RedisRepository) private readonly redisRepository: RedisRepository
  ) { }

  ttl = 60 * 1;

  async saveToRedis(dbIndex: number, prefix: string, id: string, data: any): Promise<void> {
    await this.redisRepository.set(
      dbIndex,
      prefix,
      id,
      JSON.stringify(data)
    )
  }

  async saveToRedisWithExpiry(dbIndex: number, prefix: string, id: string, data: any): Promise<void> {
    await this.redisRepository.setWithExpiry(
      dbIndex,
      prefix,
      id,
      JSON.stringify(data),
      this.ttl,
    )
  }

  async getFromRedis(dbIndex: number, prefix: string, id: string): Promise<any | null> {
    const redisData = await this.redisRepository.get(dbIndex, prefix, id)
    return JSON.parse(redisData)
  }

  async getAllFromRedis(dbIndex: number): Promise<any | null> {
    return await this.redisRepository.getAll(dbIndex)
  }

  async removeFromRedis(dbIndex: number, prefix: string, id: string): Promise<any | null> {
    return await this.redisRepository.delete(dbIndex, prefix, id)
  }

  async publishMessage(channel: string, message: string): Promise<any> {
    return await this.redisRepository.publishToChannel(channel, message)
  }

  async subscribe(channel: string): Promise<void> {
    this.redisRepository.subscribeToChannel(channel)
  }

  async getAuthResponse(requestId: string, channel: string): Promise<string> {
    return await this.redisRepository.getAuthResponseChannel(requestId, channel)
  }
}
