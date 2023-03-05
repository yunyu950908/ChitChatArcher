import { Module } from '@nestjs/common'
import { CqhttpService } from './cqhttp.service'
import { CqhttpController } from './cqhttp.controller'

@Module({
  providers: [CqhttpService],
  controllers: [CqhttpController],
})
export class CqhttpModule {}
