import { Processor, WorkerHost } from '@nestjs/bullmq'
import { Logger } from '@nestjs/common'
import { Job } from 'bullmq'
import { FETCHER_QUEUE_NAME, WORKER_OPTS } from '../app.settings'
import { FetcherError, FetcherErrorCode } from './job.errors'
import { JobService } from './job.service'
import { aggregateData, fetchData } from './job.utils'

@Processor(FETCHER_QUEUE_NAME, WORKER_OPTS)
export class JobProcessor extends WorkerHost {
  constructor(private jobService: JobService) {
    super()
  }
  private readonly logger = new Logger(JobProcessor.name)

  async process(job: Job<any, any, string>): Promise<any> {
    const inData = job.data
    const timestamp = new Date(Date.now()).toISOString()

    const keys = Object.keys(inData)
    if (keys.length == 0 || keys.length > 1) {
      throw new FetcherError(FetcherErrorCode.UnexpectedNumberOfJobs, String(keys.length))
    } else {
      const adapterHash = keys[0]
      const aggregatorId = inData[adapterHash].aggregatorId
      const feeds = inData[adapterHash].feeds
      const decimals = inData[adapterHash].decimals
      const data = await fetchData(feeds, decimals, this.logger)
      const aggregate = aggregateData(data)
      try {
        await this.jobService.insertMultipleData({ aggregatorId, timestamp, data })
        await this.jobService.insertAggregateData({
          aggregatorId,
          timestamp,
          value: aggregate
        })
      } catch (e) {
        this.logger.error(e)
      }
    }
  }
}
