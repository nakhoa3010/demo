import { Controller, Get, Param, Post, Query, Req, Body } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { ExecuteMethodDto } from './dto/executeMethod.dto'
import { ProviderService } from './provider.service'

@Controller({ path: 'provider', version: '1' })
@ApiTags('Providers')
export class ProviderController {
  constructor(private readonly providerService: ProviderService) {}

  @Get('all')
  async getAllProviders() {
    return await this.providerService.getAllProviders()
  }

  @Get('byId/:id')
  async getProviderById(@Param('id') id: string) {
    return await this.providerService.getProviderById(id)
  }

  @Get('structure')
  async getProviderStructure() {
    return await this.providerService.providerStructure()
  }

  @Get('providerEndpointTest')
  async providerEndpointTest(@Req() req: Request, @Query('coinName') coinName: string) {
    const apiKey = req.headers['api-key'] as string
    return await this.providerService.providerEndpointTest(apiKey, coinName)
  }

  @Get('providerEndpointTest2')
  async providerEndpointTest2(
    @Req() req: Request,
    @Query('coinName') coinName: string,
    @Query('price') price: number
  ) {
    const apiKey = req.headers['api-key'] as string
    return await this.providerService.providerEndpointTest2(apiKey, coinName, price)
  }

  @Post('executeMethod')
  async executeMethod(@Body() executeMethodDto: ExecuteMethodDto) {
    return await this.providerService.executeMethod(
      executeMethodDto.providerId,
      executeMethodDto.methodName,
      executeMethodDto.input
    )
  }
}
