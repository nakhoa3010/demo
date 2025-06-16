import { parseArgs } from 'node:util'
import type { RedisClientType } from 'redis'
import { createClient } from 'redis'
import { IWorkers } from './types'
import { buildLogger } from '../logger'
import { REDIS_HOST, REDIS_PASSWORD, REDIS_PORT, REDIS_USERNAME } from '../settings'
import { buildWorker as vrfWorker } from './vrf'
import { buildWorker as dataFeedWorker } from './dataFeed'
import { buildWorker as rrWorker } from './request-response'

const WORKERS: IWorkers = {
  VRF: vrfWorker,
  DATA_FEED: dataFeedWorker,
  RR: rrWorker
}

const LOGGER = buildLogger('worker')

async function main() {
  const worker = loadArgs()

  const redisClient: RedisClientType = createClient({
    url: `redis://${REDIS_USERNAME}:${REDIS_PASSWORD}@${REDIS_HOST}:${REDIS_PORT}`
  })
  await redisClient.connect()

  WORKERS[worker](redisClient, LOGGER)

  LOGGER.info('Worker launched')
}

function loadArgs() {
  const {
    values: { worker }
  } = parseArgs({
    options: {
      worker: {
        type: 'string'
      }
    }
  })

  if (!worker) {
    throw Error('Missing --worker argument.')
  }

  if (!Object.keys(WORKERS).includes(worker)) {
    throw Error(`${worker} is not supported worker.`)
  }

  return worker
}

main().catch((e) => {
  LOGGER.error(e)
  process.exitCode = 1
})
