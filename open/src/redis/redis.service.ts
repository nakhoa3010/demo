import { Inject, Injectable } from '@nestjs/common'
import Redis from 'ioredis'

@Injectable()
export class RedisService {
  constructor(
    @Inject('REDIS_CLIENT')
    private readonly redis: Redis
  ) {}

  ///
  async set(key: string, value: string, ttl?: number): Promise<'OK'> {
    if (ttl) {
      return this.redis.set(key, value, 'EX', ttl)
    }
    return this.redis.set(key, value)
  }

  async get(key: string): Promise<string | null> {
    return this.redis.get(key)
  }

  async del(key: string): Promise<number> {
    return this.redis.del(key)
  }

  async setHash(key: string, field: string, value: string): Promise<number> {
    return this.redis.hset(key, field, value)
  }

  async getHash(key: string, field: string): Promise<string | null> {
    return this.redis.hget(key, field)
  }

  async getAllHash(key: string): Promise<Record<string, string>> {
    return this.redis.hgetall(key)
  }

  async delHash(key: string, field: string): Promise<number> {
    return this.redis.hdel(key, field)
  }

  async setWithLock(key: string, value: string, ttl: number): Promise<boolean> {
    const result = (await this.redis.set(key, value, 'EX', ttl, 'NX')) as unknown as string
    return result === 'OK'
  }

  async decrementSpinCount(userKey: string, value: number = 1): Promise<number> {
    const key = `daily_spin:${userKey}`

    // Use Lua script for atomic operation
    const lua = `
      local count = redis.call('get', KEYS[1])
      if not count or tonumber(count) <= 0 then
        return -1
      end
      redis.call('decrby', KEYS[1], ARGV[1])
      return tonumber(count) - ARGV[1]
    `
    return this.redis.eval(lua, 1, key, value.toString()) as Promise<number>
  }

  async getKeyTTL(key: string): Promise<number> {
    // Returns:
    //  -2 if the key does not exist
    //  -1 if the key exists but has no associated expire
    //  number of seconds until expiration if the key has an expire time
    return this.redis.ttl(key)
  }
}
