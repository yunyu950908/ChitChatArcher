import { Module } from '@nestjs/common'
import { OpenaiService } from './openai.service'
import { OpenaiController } from './openai.controller'
import { BullModule } from '@nestjs/bull'
import { OpenaiProcessor } from './openai.processor'

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'openai',
      // defaultJobOptions: { removeOnComplete: 500 },
    }),
  ],
  providers: [OpenaiService, OpenaiProcessor],
  controllers: [OpenaiController],
})
export class OpenaiModule {}
