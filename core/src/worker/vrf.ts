import { Worker } from 'bullmq'
import { Interface, parseUnits, solidityPackedKeccak256 } from 'ethers'
import { Logger } from 'pino'
import type { RedisClientType } from 'redis'
import {
  BULLMQ_CONNECTION,
  VRF_FULLFILL_GAS_PER_WORD,
  VRF_SERVICE_NAME,
  WORKER_VRF_QUEUE_NAME
} from '../settings'
import {
  IVrfListenerWorker,
  IVrfTransactionParameters,
  IReporterConfig,
  ITransactionParameters,
  RequestCommitmentVRF,
  Proof
} from '../types'

import { VRF_COORDINATOR_ABI as VRFAbis } from '../constants/vrf.coordinator.abi'
import { getReporterByAddress, getVrfConfig } from '../apis'
import { buildWallet, sendTransaction } from './utils'

import { remove0x } from '../utils'
import { processVrfRequest } from '@xoracle/vrf'

const FILE_NAME = import.meta.url

export async function buildWorker(redisClient: RedisClientType, _logger: Logger) {
  const logger = _logger.child({ name: 'worker', file: FILE_NAME })

  const worker = new Worker(WORKER_VRF_QUEUE_NAME, await job(_logger), BULLMQ_CONNECTION)

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
  const iface = new Interface(VRFAbis)

  async function wrapper(job) {
    const inData: IVrfListenerWorker = job.data
    logger.debug(inData, 'inData')
    const vrfConfig = await getVrfConfig({ chain: inData.chain || '', logger })
    try {
      const alpha = remove0x(
        solidityPackedKeccak256(['uint256', 'bytes32'], [inData.seed, inData.blockHash])
      )

      logger.debug({ alpha })
      const { pk, proof, uPoint, vComponents } = processVrfRequest(alpha, vrfConfig)

      const payloadParameters: IVrfTransactionParameters = {
        blockNum: inData.blockNum,
        seed: inData.seed,
        accId: inData.accId,
        callbackGasLimit: inData.callbackGasLimit,
        numWords: inData.numWords,
        sender: inData.sender,
        isDirectPayment: inData.isDirectPayment,
        pk,
        proof,
        preSeed: inData.seed,
        uPoint,
        vComponents,
        chain: inData.chain
      }

      const to = inData.callbackAddress

      const reporter = await getReporterByAddress({
        service: VRF_SERVICE_NAME,
        chain: inData.chain || '',
        oracleAddress: to,
        logger
      })
      const tx = buildTransaction(
        payloadParameters,
        to,
        reporter.fulfillMinimumGas + VRF_FULLFILL_GAS_PER_WORD * inData.numWords,
        iface,
        logger
      )
      logger.debug(tx, 'tx')
      // send transaction
      await sendTx(tx, reporter, logger)
      return tx
    } catch (e) {
      logger.error(e)
      throw e
    }
  }

  return wrapper
}

function buildTransaction(
  payloadParameters: IVrfTransactionParameters,
  to: string,
  gasMinimum: number,
  iface: Interface,
  logger: Logger
): ITransactionParameters {
  const gasLimit = payloadParameters.callbackGasLimit + gasMinimum
  const rc: RequestCommitmentVRF = [
    payloadParameters.blockNum,
    payloadParameters.accId,
    payloadParameters.callbackGasLimit,
    payloadParameters.numWords,
    payloadParameters.sender
  ]
  logger.debug(rc, 'rc')

  const proof: Proof = [
    payloadParameters.pk,
    payloadParameters.proof,
    payloadParameters.preSeed,
    payloadParameters.uPoint,
    payloadParameters.vComponents
  ]
  logger.debug(proof, 'proof')

  const payload = iface.encodeFunctionData('fulfillRandomWords', [
    proof,
    rc,
    payloadParameters.isDirectPayment
  ])

  return {
    payload,
    gasLimit,
    to
  }
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
