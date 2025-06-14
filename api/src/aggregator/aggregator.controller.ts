import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Param,
  Patch,
  Post,
  Query
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { AggregatorService } from './aggregator.service'
import { IAggregator } from './aggregator.types'
import { AggregatorQueryDto } from './dto/aggregator-query.dto'
import { AggregatorUpdateDto } from './dto/aggregator-update.dto'
import { AggregatorDto } from './dto/aggregator.dto'

@Controller({
  path: 'aggregator',
  version: '1'
})
@ApiTags('Aggregator')
export class AggregatorController {
  private readonly logger = new Logger(AggregatorController.name)

  constructor(private readonly aggregatorService: AggregatorService) {}

  @Post()
  async create(@Body() aggregatorDto: AggregatorDto) {
    return await this.aggregatorService.create(aggregatorDto)
  }

  @Post('hash')
  async generateHash(@Body() aggregatorDto: AggregatorDto, @Query('verify') verify?: boolean) {
    const aggregator: IAggregator = {
      aggregatorHash: aggregatorDto.aggregatorHash,
      name: aggregatorDto.name,
      heartbeat: aggregatorDto.heartbeat,
      threshold: aggregatorDto.threshold,
      absoluteThreshold: aggregatorDto.absoluteThreshold,
      adapterHash: aggregatorDto.adapterHash
    }

    return await this.aggregatorService.computeAggregatorHash({
      data: aggregator,
      verify: verify
    })
  }

  /**
   * Find all `Aggregator`s based on their `active`ness and assigned `chain`.
   * Used by `Network Aggregator` during launch of worker.
   *
   * @Query {AggregatorQuerydto}
   */
  @Get()
  async findAll(@Query() query: AggregatorQueryDto) {
    const { active, chain, address } = query
    return await this.aggregatorService.findAll({
      where: {
        active: active ? Boolean(active) : active,
        Chain: { name: chain },
        address
      },
      orderBy: {
        id: 'asc'
      }
    })
  }

  /**
   * Find unique `Aggregator` given `aggregatorHash` and `chain`.
   * Used by ` Network Aggregator` to receive metadata about
   * aggregator, its adapter and related data feeds.
   *
   * @Param {string} aggregatorHash
   * @Param {string} chain
   */
  @Get('hash/:hash/:chain')
  async findUnique(@Param('hash') aggregatorHash: string, @Param('chain') chain: string) {
    // aggregator
    const aggregatorRecord = await this.aggregatorService.findFirst(aggregatorHash, chain)
    if (aggregatorRecord == null) {
      const msg = `Aggregator [${aggregatorHash}] not found`
      this.logger.error(msg)
      throw new HttpException(msg, HttpStatus.NOT_FOUND)
    }

    try {
      await this.aggregatorService.verifyAggregatorHashOnLoad({
        aggregatorHash
      })
    } catch (e) {
      const msg = `verify Aggregator hash [${aggregatorHash}] failed on load`
      this.logger.error(msg)
      throw new HttpException(msg, HttpStatus.METHOD_NOT_ALLOWED)
    }
    return aggregatorRecord
  }

  @Get(':name')
  async findByName(@Param('name') name: string) {
    // aggregator
    const aggregatorRecord = await this.aggregatorService.findUnique({
      name
    })
    if (aggregatorRecord == null) {
      const msg = `Aggregator [${name}] not found`
      this.logger.error(msg)
      throw new HttpException(msg, HttpStatus.NOT_FOUND)
    }

    try {
      await this.aggregatorService.verifyAggregatorHashOnLoad({
        name
      })
    } catch (e) {
      const msg = `verify Aggregator hash [${name}] failed on load`
      this.logger.error(msg)
      throw new HttpException(msg, HttpStatus.METHOD_NOT_ALLOWED)
    }
    return aggregatorRecord
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.aggregatorService.remove({ id: Number(id) })
  }

  @Patch(':id')
  async update(
    @Param('id') aggregatorHash: string,
    @Body('data') aggregatorUpdateDto: AggregatorUpdateDto
  ) {
    return await this.aggregatorService.update({
      where: { aggregatorHash },
      active: aggregatorUpdateDto.active
    })
  }

  @Get('hashName/:name')
  async hashName(@Param('name') name: string) {
    return await this.aggregatorService.computeNameHash(name)
  }

  @Post('hashName')
  async hashAllName() {
    return await this.aggregatorService.hashAllName()
  }
}
