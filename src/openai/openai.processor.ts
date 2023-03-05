import { Process, Processor } from '@nestjs/bull'
import { Logger } from '@nestjs/common'
import { Job } from 'bull'

@Processor('openai')
export class OpenAIProcessor {
  private readonly logger = new Logger(OpenAIProcessor.name)

  @Process({ name: 'unofficial', concurrency: 1 })
  handleUnofficialCall(job: Job) {
    this.logger.debug('Start fetching...')
    this.logger.debug(job.data)
    this.logger.debug('Fetching completed')
  }

  @Process({ name: 'official', concurrency: 5 })
  handleOfficialCall(job: Job) {
    this.logger.debug('Start fetching...')
    this.logger.debug(job.data)
    this.logger.debug('Fetching completed')
  }
}
