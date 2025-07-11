import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { AdapterService } from './adapter.service'
import { AdapterDto } from './dto/adapter.dto'

@Controller({
  path: 'adapter',
  version: '1'
})
@ApiTags('Adapter')
export class AdapterController {
  constructor(private readonly adapterService: AdapterService) {}

  @Post()
  async create(@Body() adapterDto: AdapterDto) {
    return await this.adapterService.create(adapterDto)
  }

  @Post('hash')
  async generateHash(@Body() adapterDto: AdapterDto, @Query('verify') verify?: boolean) {
    return await this.adapterService.computeAdapterHash({ data: adapterDto, verify: verify })
  }

  @Get()
  async findAll() {
    return await this.adapterService.findAll({ orderBy: { id: 'asc' } })
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.adapterService.findOne({ id: Number(id) })
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.adapterService.remove({ id: Number(id) })
  }
}
