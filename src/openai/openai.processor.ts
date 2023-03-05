import { Process, Processor } from '@nestjs/bull'
import { Logger } from '@nestjs/common'
import axios from 'axios'
import { Job } from 'bull'
import { omit } from 'lodash'
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
    const { prompt, userId, notifyURL } = job.data
    const resp = await this.openaiService.unofficialChatGPTAsk({ prompt })
    this.logger.debug(
      `[handleUnofficialCall]: ${job.id} - ${JSON.stringify(
        omit(resp.data, 'message'),
      )}`,
    )
    /**
     * 发送成功回调
     */
    const notifyData = {
      success: true,
      data: {
        userId,
        ...resp.data,
      },
    }
    await axios.post(notifyURL, notifyData)
  }

  @Process({ name: 'official', concurrency: 5 })
  handleOfficialCall(job: Job) {
    this.logger.debug(
      `[handleOfficialCall]: ${job.id} - ${JSON.stringify(job.data)}`,
    )
  }
}
