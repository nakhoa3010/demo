import { Injectable } from '@nestjs/common'
import axios from 'axios'
import { COINGECKO_API_KEY, COINGECKO_API_URL } from '../app.settings'
import { PrismaService } from '../prisma.service'
import { RedisService } from '../redis/redis.service'
import { FeedType } from './data-feed.types'

@Injectable()
export class DataFeedService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService
  ) {}

  async list() {
    const aggregators = await this.prisma.aggregator.findMany({
      where: {
        active: true
      },
      include: {
        adapter: true,
        Aggregate: {
          orderBy: {
            timestamp: 'desc'
          },
          take: 1
        },
        Chain: true
      }
    })

    // get market cap from coingecko
    const data = await Promise.all(
      aggregators.map(async (m) => {
        let marketCap = null
        const symbol = m.adapter.name.split('-')[0].toLowerCase()
        const endpoint = `${COINGECKO_API_URL}/simple/price?vs_currencies=usd&symbols=${symbol}&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true&include_last_updated_at=true`
        try {
          const res = await axios.get(endpoint, {
            headers: {
              'x-cg-pro-api-key': COINGECKO_API_KEY
            }
          })
          marketCap = res.data[symbol].usd_market_cap
          // save to redis
          const key = `market_cap:${m.address}`

          if (!marketCap) {
            const redisMarketCap = await this.redis.get(key)
            if (redisMarketCap) {
              marketCap = Number(redisMarketCap)
            }
          } else {
            await this.redis.set(key, marketCap, 60 * 60 * 24)
          }
        } catch (error) {}
        return {
          address: m.address,
          name: m.name,
          decimals: m.adapter.decimals,
          lastedPrice: m.Aggregate[0].value.toString(),
          marketCap: marketCap?.data[symbol]?.usd_market_cap || 0,
          chainId: m.Chain.chainId,
          chainName: m.Chain.name,
          iconUrl: m.Chain.iconUrl,
          type: FeedType.premium
        }
      })
    )
    return data
  }
}
