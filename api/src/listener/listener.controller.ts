import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { CreateListenerDto } from './dto/create-listener.dto'
import { UpdateListenerDto } from './dto/update-listener.dto'
import { ListenerService } from './listener.service'

@Controller({
  path: 'listener',
  version: '1'
})
@ApiTags('Listener')
export class ListenerController {
  constructor(private readonly listenerService: ListenerService) {}

  @Post()
  async create(@Body() createListenerDto: CreateListenerDto) {
    return await this.listenerService.create(createListenerDto)
  }

  @Get()
  async findAll(@Body('chain') chain: string, @Body('service') service: string) {
    return await this.listenerService.findAll({
      where: {
        chain: { name: chain },
        service: { name: service }
      }
    })
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.listenerService.findOne({ id: Number(id) })
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateListenerDto: UpdateListenerDto) {
    return await this.listenerService.update({
      where: { id: Number(id) },
      updateListenerDto
    })
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.listenerService.remove({ id: Number(id) })
  }
}
