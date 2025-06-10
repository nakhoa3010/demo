import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'
import { setAppSetting } from './app.settings'
async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  setAppSetting(app)
  const version = '1.0'
  const config = new DocumentBuilder()
    .setTitle('X Oracle API')
    .setDescription('X Oracle API description')
    .setVersion(version)
    .addBearerAuth(
      {
        type: 'apiKey',
        scheme: 'JWT',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Type into the text box: Bearer {your JWT token}',
        in: 'header'
      },
      'JWT'
    )
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('fetcher/docs', app, document)
  const configService = app.get(ConfigService)
  const port = configService.get('APP_PORT')
  await app.listen(port)
  console.log(`app started with ${port}`)
}
bootstrap()
