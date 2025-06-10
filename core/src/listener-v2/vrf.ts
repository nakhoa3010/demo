import { Interface, Log } from 'ethers'
import { Logger } from 'pino'
import { listenerServiceV2 } from './listener'
import { IRandomWordsRequested, IVrfListenerWorker } from '../types'
import { IProcessEventListenerJobV2, ProcessEventOutputType } from './types'
import {
  LISTENER_VRF_PROCESS_EVENT_QUEUE_NAME,
  WORKER_VRF_QUEUE_NAME,
  BULLMQ_CONNECTION,
  LISTENER_JOB_SETTINGS,
  LISTENER_V2_PORT,
  WEBHOOK_KEY
} from '../settings'
import { VRF_COORDINATOR_ABI } from '../constants/vrf.coordinator.abi'
import { Queue } from 'bullmq'
import { getUniqueEventIdentifier } from './utils'
import express, { Request, Response } from 'express'
import { getVrfConfig } from '../apis'
const FILE_NAME = import.meta.url

export async function buildListener(logger: Logger) {
  const processEventQueueName = LISTENER_VRF_PROCESS_EVENT_QUEUE_NAME
  const workerQueueName = WORKER_VRF_QUEUE_NAME
  const iface = new Interface(VRF_COORDINATOR_ABI)
  const app = express()

  listenerServiceV2({
    processEventQueueName,
    workerQueueName,
    processFn: await processEvent({ iface, logger }),
    logger
  })

  app.post('/events', async (req: Request, res: Response) => {
    logger.debug('/events')
    try {
      let body = ''
      req.on('data', (chunk) => {
        body += chunk.toString()
      })
      req.on('end', () => {
        const key = req.headers['x-oracle-key']
        if (key !== WEBHOOK_KEY) {
          res.status(401).send('Unauthorized')
          return
        }
        const data = JSON.parse(body)
        if (data && data.events && data.events.length > 0) {
          vrfStreamListener({ chain: data.chain, events: data.events, iface })
        }
        res.status(200).send('Webhook received')
      })
    } catch (e) {
      logger.error(e)
      res.status(500).send(e)
    }
  })

  app.listen(LISTENER_V2_PORT, () => {
    logger.info(`Listener v2 listening on port ${LISTENER_V2_PORT}`)
  })

  // Handle graceful shutdown
  async function handleExit() {
    logger.info('Exiting. Wait for graceful shutdown.')

    // Close the express server
    await new Promise<void>((resolve) => {
      app.listen().close(() => {
        logger.info('Express server closed')
        resolve()
      })
    })

    process.exit(0)
  }

  // Listen for termination signals
  process.on('SIGINT', handleExit)
  process.on('SIGTERM', handleExit)
}

async function processEvent({ iface, logger }: { iface: Interface; logger: Logger }) {
  const _logger = logger.child({ name: 'processEvent', file: FILE_NAME })

  async function wrapper(log, chain): Promise<ProcessEventOutputType | undefined> {
    const eventData = iface.parseLog(log)?.args as unknown as IRandomWordsRequested
    _logger.debug(eventData, 'eventData')
    const { keyHash } = await getVrfConfig({ chain })

    if (eventData.keyHash != keyHash) {
      _logger.info(`Ignore event with keyhash [${eventData.keyHash}]`)
    } else {
      const jobName = 'vrf'
      const requestId = eventData.requestId.toString()
      const jobData: IVrfListenerWorker = {
        callbackAddress: log.address,
        blockNum: log.blockNumber,
        blockHash: log.blockHash,
        requestId,
        seed: eventData.preSeed.toString(),
        accId: Number(eventData.accId),
        callbackGasLimit: eventData.callbackGasLimit,
        numWords: eventData.numWords,
        sender: eventData.sender,
        isDirectPayment: eventData.isDirectPayment
      }
      _logger.debug(jobData, 'jobData')

      return { jobName, jobId: requestId, jobData }
    }
  }

  return wrapper
}

export async function vrfStreamListener({
  chain,
  events,
  iface
}: {
  chain: string
  events: Log[]
  iface: Interface
}) {
  const processEventQueue = new Queue(LISTENER_VRF_PROCESS_EVENT_QUEUE_NAME, BULLMQ_CONNECTION)
  for (const [index, event] of events.entries()) {
    const eventData = iface?.parseLog(event)
    if (!eventData) {
      continue
    }
    if (eventData.name !== 'RandomWordsRequested') {
      continue
    }
    const outData: IProcessEventListenerJobV2 = {
      chain,
      contractAddress: event.address,
      event
    }
    const jobId = getUniqueEventIdentifier(event, index)
    await processEventQueue.add('latest', outData, {
      jobId,
      ...LISTENER_JOB_SETTINGS
    })
    console.log(`Added job ${jobId} to queue ${LISTENER_VRF_PROCESS_EVENT_QUEUE_NAME}`)
  }
}
