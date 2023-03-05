import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { OpenaiModule } from './openai/openai.module'
import { CqhttpModule } from './cqhttp/cqhttp.module'

@Module({
  imports: [OpenaiModule, CqhttpModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
