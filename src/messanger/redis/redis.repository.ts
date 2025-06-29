import {Inject, Injectable, OnModuleDestroy} from '@nestjs/common'

import {Error} from 'mongoose'
import {RedisRepositoryInterface} from 'src/messanger/redis/redis.repository.interface'
import {EventEmitter2} from "@nestjs/event-emitter";
import {Redis} from "ioredis";


@Injectable()
export class RedisRepository implements OnModuleDestroy, RedisRepositoryInterface {
  constructor(
    @Inject('REDIS_CACHE_CLIENT') private readonly redisCacheClient: Redis,
    @Inject('REDIS_PUBSUB_CLIENT') private readonly redisPubSubClient: Redis,
    private eventEmitter: EventEmitter2
  ) { }

  onModuleDestroy(): void {
    this.redisCacheClient.disconnect()
    this.redisPubSubClient.disconnect()
  }

  async get(dbIndex: number, prefix: string, key: string): Promise<string | null> {
    try {
      // Switch to the specified database index
      await this.redisCacheClient.select(dbIndex)
      return this.redisCacheClient.get(`${prefix}:${key}`)
    } catch (error) {
      console.error('Redis get Error:', error)
      throw error
    }
  }

  async getAll(dbIndex: number) {
    await this.redisCacheClient.select(dbIndex)
    let redisValues: string[] = []

    // Fetch all keys from Redis
    await this.redisCacheClient.keys('*').then(keys => {
      // Fetch values for each key
      const multi = this.redisCacheClient.multi()
      keys.forEach(key => {
        multi.get(key)
      })

      // Execute the multi command to get all values
      return multi.exec()
    }).then(results => {
      // Extract values from the results
      redisValues = results.map(result => JSON.parse(result[1].toString()))

      console.log(redisValues)
    }).catch(error => {
      console.error(error)
      throw error
    })

    return redisValues
  }

  async set(dbIndex: number, prefix: string, key: string, value: string): Promise<void> {
    try {
      await this.redisCacheClient.select(dbIndex)
      await this.redisCacheClient.set(`${prefix}:${key}`, value)
    } catch (error) {
      console.error('Redis set Error:', error)
      throw error
    }
  }

  async delete(dbIndex: number, prefix: string, key: string): Promise<void> {
    try {
      await this.redisCacheClient.select(dbIndex)
      await this.redisCacheClient.del(`${prefix}:${key}`)
    } catch (error) {
      console.error('Redis delete Error:', error)
      throw error
    }
  }

  async flush(dbIndex: number): Promise<void> {
    try {
      await this.redisCacheClient.select(dbIndex)
      await this.redisCacheClient.flushall()
    } catch (error) {
      console.error('Redis flush Error:', error)
      throw error
    }
  }

  async setWithExpiry(dbIndex: number, prefix: string, key: string, value: string, expiry: number): Promise<void> {
    try {
      await this.redisCacheClient.select(dbIndex)
      await this.redisCacheClient.set(`${prefix}:${key}`, value, 'EX', expiry)
    } catch (error) {
      console.error('Redis write Error:', error)
      throw error
    }
  }

  async publishToChannel(channel: string, message: string): Promise<number> {
    const numberOfSubscribers = await this.redisPubSubClient.publish(channel, message)
    return numberOfSubscribers
  }

  subscribeToChannel(channel: string): void {
    this.redisPubSubClient.subscribe(channel)
    this.redisPubSubClient.on('message', (subscribedChannel, message) => {
      this.eventEmitter.emit(subscribedChannel, message)
    })
  }

  async getAuthResponseChannel(requestId: string, channel: string): Promise<string> {

    return new Promise((resolve, reject) => {
      // Subscribe to the specified Redis channel
      this.redisCacheClient.subscribe(channel)

      // Set up an event listener for the 'message' event
      this.redisCacheClient.on('message', (subscribedChannel, message) => {
        let msg = JSON.parse(message)
        // if (message.length > 0) {
        if (msg.id == requestId) {
          resolve(message)
        }
        else {
          reject(new Error('Received message with no content.'))
        }

        // Unsubscribe from the channel after receiving the first message
        this.redisCacheClient.unsubscribe(channel)

      })

    })
  }

  unsubscribeFromChannel(channel: string): void {
    this.redisPubSubClient.unsubscribe(channel)
  }

  unsubscribeFromAllChannels(): void {
    this.redisPubSubClient.unsubscribe()
  }
}
