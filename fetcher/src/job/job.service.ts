import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common'
import { AggregateService } from '../aggregate/aggregate.service'
import { AggregatorService } from '../aggregator/aggregator.service'
import { DataService } from '../data/data.service'

import { DatumDto } from '../data/dto/datum.dto'
import { IRawData } from './job.types'

@Injectable()
export class JobService {
  constructor(
    private readonly dataService: DataService,
    private readonly aggregateService: AggregateService,
    private readonly aggregatorService: AggregatorService
  ) {}

  async loadActiveAggregators({ logger }: { logger: Logger }) {
    try {
      const result = await this.aggregatorService.findAll({ where: { active: true } })
      return result
    } catch (e) {
      const msg = `Loading aggregators with filter active:true failed.`
      logger.error(msg)
      throw new HttpException(msg, HttpStatus.BAD_REQUEST)
    }
  }

  async loadAggregator({ aggregatorHash, logger }: { aggregatorHash: string; logger: Logger }) {
    try {
      const aggregator = await this.aggregatorService.findUnique({ aggregatorHash })
      return aggregator
    } catch (e) {
      const msg = `Loading aggregator with hash ${aggregatorHash} failed.`
      logger.error(msg)
      throw new HttpException(msg, HttpStatus.BAD_REQUEST)
    }
  }

  async insertAggregateData({
    aggregatorId,
    timestamp,
    value
  }: {
    aggregatorId: string
    timestamp: string
    value: number
  }) {
    return await this.aggregateService.create({
      aggregatorId: Number(aggregatorId),
      timestamp,
      value
    })
  }

  async insertMultipleData({
    aggregatorId,
    timestamp,
    data
  }: {
    aggregatorId: string
    timestamp: string
    data: IRawData[]
  }) {
    const _data: DatumDto[] = data.map((d) => {
      return {
        aggregatorId: Number(aggregatorId),
        feedId: d.id,
        timestamp: timestamp,
        value: BigInt(d.value)
      }
    })
    return await this.dataService.createMany(_data)
  }

  async updateAggregator(aggregatorHash: string, active: boolean) {
    const response = await this.aggregatorService.update({ where: { aggregatorHash }, active })
    return response
  }
}
