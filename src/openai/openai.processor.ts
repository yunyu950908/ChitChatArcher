import { Process, Processor } from '@nestjs/bull'
import { Logger } from '@nestjs/common'
import { Job } from 'bull'
import { OpenaiService } from './openai.service'

@Processor('openai')
export class OpenaiProcessor {
  private readonly logger = new Logger(OpenaiProcessor.name)

  constructor(private readonly openaiService: OpenaiService) {}

  @Process({ name: 'unofficial', concurrency: 1 })
  async handleUnofficialCall(job: Job) {
    this.logger.debug(
      `[handleUnofficialCall]: ${job.id} - ${JSON.stringify(job.data)}`,
    )
    const { prompt } = job.data
    const resp = await this.openaiService.unofficialChatGPTAsk({ prompt })
    this.logger.debug(
      `[handleUnofficialCall]: ${job.id} - ${JSON.stringify(resp)}`,
    )
  }

  @Process({ name: 'official', concurrency: 5 })
  handleOfficialCall(job: Job) {
    this.logger.debug(
      `[handleOfficialCall]: ${job.id} - ${JSON.stringify(job.data)}`,
    )
  }
}
