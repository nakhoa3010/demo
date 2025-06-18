import { INestApplication, RequestMethod, VersioningType } from '@nestjs/common'
import * as dotenv from 'dotenv'
dotenv.config()

export const FETCHER_QUEUE_NAME = 'x-oracle-fetcher-queue'

export const WORKER_OPTS = { concurrency: Number(process.env.CONCURRENCY) || 20 }

export const FETCH_FREQUENCY = 7_200_000

export const FETCH_TIMEOUT = 1_000

export const DEVIATION_QUEUE_NAME = 'x-oracle-deviation-queue'

export const FETCHER_TYPE = process.env.FETCHER_TYPE || 0

export const PROVIDER_URL = process.env.PROVIDER_URL || ''

export const COINGECKO_API_URL = process.env.COINGECKO_API_URL || ''

export const COINGECKO_API_KEY = process.env.COINGECKO_API_KEY || ''

export const RPC_URL = process.env.RPC_URL || ''

export function setAppSetting(app: INestApplication) {
  app.setGlobalPrefix('api', {
    exclude: [{ path: 'health', method: RequestMethod.GET }]
  })

  app.enableVersioning({
    type: VersioningType.URI
  })

  app.enableCors({
    origin: ['http://localhost:3000'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204
  })
}
