import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { Cron } from 'croner'
import { PrismaService } from '../prisma.service'

@Injectable()
export class CronService {
  constructor(private readonly prismaService: PrismaService) {
    new Cron('0 0 * * *', async () => {
      await this.copyTable()
    })
  }

  async copyTable() {
    const date = new Date()
    const tableNames = ['data', 'aggregates']
    const prefix = `${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date
      .getDate()
      .toString()
      .padStart(2, '0')}${date.getHours().toString().padStart(2, '0')}${date
      .getMinutes()
      .toString()
      .padStart(2, '0')}${date.getSeconds().toString().padStart(2, '0')}`
    for (let i = 0; i < tableNames.length; i++) {
      const name = tableNames[i]
      const newName = `${name}_${prefix}`
      try {
        await this.prismaService.$executeRawUnsafe(
          `CREATE TABLE ${newName} AS TABLE ${name} WITH DATA;`
        )
        await this.prismaService.$executeRawUnsafe(`TRUNCATE ${name} `)
      } catch (error) {
        console.log(`copy table error`, error)
      }
    }
  }

  async uploadToClient() {
    const aggregators = await this.prismaService.aggregator.findMany()
    const data = await Promise.all(
      aggregators.map(async (m) => {
        const query = Prisma.sql`SELECT aggregate_id as id, timestamp, value, aggregator_id as "aggregatorId"
            FROM aggregates
            WHERE aggregator_id = ${m.id}
            ORDER BY timestamp DESC
            LIMIT 1;`
        const result: Prisma.AggregateScalarFieldEnum[] = await this.prismaService.$queryRaw(query)
        if (result && result.length == 1) {
          return {
            id: result[0]['id'],
            value: Number(result[0]['value']),
            timestamp: result[0]['timestamp'],
            aggregatorId: result[0]['aggregatorId'],
            aggregatorHash: m.aggregatorHash
          }
        }
      })
    )

    //const rs = await uploadData('hello')
  }
}
