import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { OpenaiModule } from './openai/openai.module'
import { CqhttpModule } from './cqhttp/cqhttp.module'
import { BullModule } from '@nestjs/bull'

@Module({
  imports: [
    OpenaiModule,
    CqhttpModule,
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
        keyPrefix: 'chitchatarcher',
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
