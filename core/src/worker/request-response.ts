import { Worker } from 'bullmq'
import { Interface } from 'ethers'
import { Logger } from 'pino'
import type { RedisClientType } from 'redis'
import {
  BULLMQ_CONNECTION,
  RR_FULLFILL_GAS_MINIMUM,
  RR_SERVICE_NAME,
  WORKER_RR_QUEUE_NAME
} from '../settings'
import {
  IRequestResponseListenerWorker,
  IRequestResponseTransactionParameters,
  IReporterConfig,
  IErrorMsgData
} from '../types'

import { RequestResponseAbi } from '../constants/rr.coordinator.abi'
import { buildWallet, sendTransaction } from './utils'
import { XOracleError } from '../errors'
import { decodeRequest } from './decoding'
import { pipe, buildReducer, REDUCER_MAPPING } from '../utils'
import axios from 'axios'
import { getReporterByAddress } from '../apis'
import { buildTransaction } from './request-response.utils'

const FILE_NAME = import.meta.url

export async function buildWorker(redisClient: RedisClientType, _logger: Logger) {
  const logger = _logger.child({ name: 'worker', file: FILE_NAME })

  const worker = new Worker(WORKER_RR_QUEUE_NAME, await job(_logger), BULLMQ_CONNECTION)

  async function handleExit() {
    logger.info('Exiting. Wait for graceful shutdown.')

    await redisClient.quit()
    await worker.close()
  }
  process.on('SIGINT', handleExit)
  process.on('SIGTERM', handleExit)
}

export async function job(_logger: Logger) {
  const logger = _logger.child({ name: 'job', file: FILE_NAME })
  const iface = new Interface(RequestResponseAbi)

  async function wrapper(job: any) {
    const inData: IRequestResponseListenerWorker = job.data
    logger.debug(inData, 'inData')

    try {
      const response = await processRequest(inData.data, _logger)

      const payloadParameters: IRequestResponseTransactionParameters = {
        blockNum: inData.blockNum,
        accId: inData.accId,
        jobId: inData.jobId,
        requestId: inData.requestId,
        numSubmission: inData.numSubmission,
        callbackGasLimit: inData.callbackGasLimit,
        sender: inData.sender,
        isDirectPayment: inData.isDirectPayment,
        response,
        chain: inData.chain
      }
      const to = inData.callbackAddress

      const tx = buildTransaction(payloadParameters, to, RR_FULLFILL_GAS_MINIMUM, iface, logger)
      logger.debug(tx, 'tx')
      // get reporter
      const reporter = await getReporterByAddress({
        service: RR_SERVICE_NAME,
        chain: inData.chain || '',
        oracleAddress: to,
        logger
      })
      await sendTx(tx, reporter, logger)
      return tx
    } catch (e) {
      const error = e as Error | XOracleError
      logger.error(error)

      const errorData: IErrorMsgData = {
        requestId: inData.requestId,
        timestamp: new Date(Date.now()).toISOString(),
        code: error instanceof XOracleError ? error.code.toString() : '',
        name: error.name.toString(),
        stack: JSON.stringify(error)
      }
      logger.error(errorData)
      throw error
    }
  }

  return wrapper
}

async function processRequest(reqEnc: string, _logger: Logger): Promise<string | number> {
  const logger = _logger.child({ name: 'processRequest', file: FILE_NAME })
  const req = await decodeRequest(reqEnc)
  logger.debug(req, 'req')

  const options = {
    method: 'GET'
  }
  const rawData = (await axios.get(req[0].args, options)).data
  const reducers = buildReducer(REDUCER_MAPPING, req.slice(1))
  const res = pipe(...reducers)(rawData)

  logger.debug(res, 'res')
  return res
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function sendTx(tx: any, reporter: IReporterConfig, logger: Logger) {
  const wallet = buildWallet({
    privateKey: reporter.privateKey,
    providerUrl: reporter.chainRpcs[0].rpcUrl
  })
  if (!reporter.fulfillMinimumGas) {
    throw new Error('Fulfill minimum gas is not set')
  }
  const txParams = {
    wallet,
    to: tx.to,
    payload: tx.payload,
    gasLimit: tx.gasLimit,
    logger
  }
  const txReceipt = await sendTransaction(txParams)
  logger.info(`submitted tx ${txReceipt.hash}`)
}
