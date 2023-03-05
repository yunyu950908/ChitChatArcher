import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { OpenaiModule } from './openai/openai.module'
import { CqhttpModule } from './cqhttp/cqhttp.module'
import { ChatModule } from './chat/chat.module'

@Module({
  imports: [OpenaiModule, CqhttpModule, ChatModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
