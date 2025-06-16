import { ethers, Interface } from 'ethers'
import { Logger } from 'pino'
import { XOracleError, XOracleErrorCode } from '../errors'
import {
  IRequestResponseTransactionParameters,
  ITransactionParameters,
  RequestCommitmentRequestResponse
} from '../types'

export const JOB_ID_UINT128 = ethers.id('uint128')
export const JOB_ID_INT256 = ethers.id('int256')
export const JOB_ID_BOOL = ethers.id('bool')
export const JOB_ID_STRING = ethers.id('string')
export const JOB_ID_BYTES32 = ethers.id('bytes32')
export const JOB_ID_BYTES = ethers.id('bytes')

export const JOB_ID_MAPPING = {
  [JOB_ID_UINT128]: 'fulfillDataRequestUint128',
  [JOB_ID_INT256]: 'fulfillDataRequestInt256',
  [JOB_ID_BOOL]: 'fulfillDataRequestBool',
  [JOB_ID_STRING]: 'fulfillDataRequestString',
  [JOB_ID_BYTES32]: 'fulfillDataRequestBytes32',
  [JOB_ID_BYTES]: 'fulfillDataRequestBytes'
}

export function buildTransaction(
  payloadParameters: IRequestResponseTransactionParameters,
  to: string,
  gasMinimum: number,
  iface: Interface,
  logger: Logger
): ITransactionParameters {
  const gasLimit = payloadParameters.callbackGasLimit + gasMinimum

  const fulfillDataRequestFn = JOB_ID_MAPPING[payloadParameters.jobId]
  if (fulfillDataRequestFn == undefined) {
    const msg = `Unknown jobId ${payloadParameters.jobId}`
    logger.error(msg)
    throw new XOracleError(XOracleErrorCode.UnknownRequestResponseJob, msg)
  }

  let response
  switch (payloadParameters.jobId) {
    case JOB_ID_UINT128:
    case JOB_ID_INT256:
      let responseOriginal = payloadParameters.response
      if (typeof responseOriginal === 'object') {
        responseOriginal = Object.values(payloadParameters.response)[0]
      }
      response = Math.floor(responseOriginal)
      break
    case JOB_ID_BOOL:
      let responseOriginalBool = payloadParameters.response
      if (typeof responseOriginalBool === 'object') {
        responseOriginalBool = Object.values(payloadParameters.response)[0]
      }
      if (
        typeof responseOriginalBool === 'string' &&
        responseOriginalBool.toLowerCase() == 'false'
      ) {
        response = false
      } else {
        response = Boolean(responseOriginalBool)
      }
      break
    case JOB_ID_STRING:
      let responseOriginalString = payloadParameters.response
      if (typeof responseOriginalString === 'object') {
        responseOriginalString = Object.values(payloadParameters.response)[0]
      }
      response = String(responseOriginalString)
      break
    case JOB_ID_BYTES32:
    case JOB_ID_BYTES:
      let responseOriginalBytes = payloadParameters.response
      if (typeof responseOriginalBytes === 'object') {
        responseOriginalBytes = Object.values(payloadParameters.response)[0]
      }
      response = responseOriginalBytes
      break
  }

  const rc: RequestCommitmentRequestResponse = [
    payloadParameters.blockNum,
    payloadParameters.accId,
    payloadParameters.numSubmission,
    payloadParameters.callbackGasLimit,
    payloadParameters.sender,
    payloadParameters.isDirectPayment,
    payloadParameters.jobId
  ]
  logger.debug(rc, 'rc')

  const payload = iface.encodeFunctionData(fulfillDataRequestFn, [
    payloadParameters.requestId,
    response,
    rc
  ])

  const tx = {
    payload,
    gasLimit,
    to
  }
  logger.debug(tx, 'tx')

  return tx
}
