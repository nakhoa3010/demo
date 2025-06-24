import { INestApplication, RequestMethod, VersioningType } from '@nestjs/common'
import * as dotenv from 'dotenv'
dotenv.config()

export const FLIPCOIN_ADDRESS = process.env.FLIPCOIN_ADDRESS || ''

export const RPC_URL = process.env.RPC_URL || ''

export function setAppSetting(app: INestApplication) {
  app.setGlobalPrefix('api', {
    exclude: [{ path: 'health', method: RequestMethod.GET }]
  })

  app.enableVersioning({
    type: VersioningType.URI
  })

  app.enableCors({
    origin: ['http://localhost:3000', 'example.x-oracle.com'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204
  })
}
