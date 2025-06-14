import { Worker } from 'bullmq'
import { Interface, AbiCoder } from 'ethers'
import { Logger } from 'pino'
import type { RedisClientType } from 'redis'
import { BULLMQ_CONNECTION, ADCS_SERVICE_NAME, WORKER_ADCS_QUEUE_NAME } from '../settings'
import { IADCSListenerWorker, IADCSTransactionParameters, IReporterConfig } from '../types'

import { add0GKey, executeAdapterById } from './api'
import { buildTransaction } from './adcs.utils'
import { ADCS_ABI as ADCSAbis } from '../constants/adcs.coordinator.abi'
import { getReporterByAddress } from '../apis'
import { buildWallet, sendTransaction } from './utils'
import { decodeRequest } from './decoding'

const FILE_NAME = import.meta.url

export async function buildWorker(redisClient: RedisClientType, _logger: Logger) {
  const logger = _logger.child({ name: 'worker', file: FILE_NAME })
  const worker = new Worker(WORKER_ADCS_QUEUE_NAME, await job(_logger), BULLMQ_CONNECTION)

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
  const iface = new Interface(ADCSAbis)

  async function wrapper(job) {
    const inData: IADCSListenerWorker = job.data
    logger.debug(inData, 'inData')
    // decode data
    const decodedData = await decodeRequest(inData.data)
    try {
      const input = decodedData.reduce((acc, item) => {
        acc[item.function] = item.args
        return acc
      }, {})
      const { response, fulfillDataRequestFn, outputType, outputEntity } = await executeAdapterById(
        `A${inData.jobId}`,
        input
      )
      if (!response) {
        throw new Error('No response')
      }

      let formattedResponse = response
      // process output type data
      if (outputType.toLowerCase() != 'bytes') {
        if (typeof response === 'object') {
          formattedResponse = Object.values(response)[0]
        } else {
          formattedResponse = response
        }
      }

      if (outputType.toLowerCase() === 'bytes') {
        // encode object to bytes that can be attract in solidity
        const objectKeys = Object.keys(response)
        const objectValues = Object.values(response)
        const encodeData = AbiCoder.defaultAbiCoder().encode(objectKeys, objectValues)
        formattedResponse = encodeData
      }
      const payloadParameters: IADCSTransactionParameters = {
        blockNum: inData.blockNum,
        requestId: inData.requestId,
        callbackGasLimit: inData.callbackGasLimit,
        sender: inData.sender,
        response: formattedResponse,
        jobId: inData.jobId,
        fulfillDataRequestFn: fulfillDataRequestFn
      }
      const to = inData.callbackAddress

      const reporter = await getReporterByAddress({
        service: ADCS_SERVICE_NAME,
        chain: inData.chain || '',
        oracleAddress: to,
        logger
      })
      const tx = buildTransaction(payloadParameters, to, reporter.fulfillMinimumGas, iface, logger)
      logger.debug(tx, 'tx')
      //send transaction
      await sendTx(tx, reporter, logger)

      return tx
    } catch (e) {
      logger.error(e)
      throw e
    }
  }

  return wrapper
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
    gasLimit: reporter.fulfillMinimumGas,
    logger
  }
  await sendTransaction(txParams)
  logger.info('submit success')
}
