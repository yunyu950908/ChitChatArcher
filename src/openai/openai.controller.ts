import {
  BadRequestException,
  Body,
  Controller,
  Logger,
  Post,
  Res,
} from '@nestjs/common'
import assert from 'assert'
import { OpenaiService, UnofficialChatGPTAsk } from './openai.service'

@Controller('openai')
export class OpenaiController {
  private readonly logger = new Logger(OpenaiController.name)

  constructor(private readonly openaiService: OpenaiService) {}

  @Post('unofficial/health')
  async healthCheck(@Res() res: any) {
    const resp = await this.openaiService.unofficialChatGPTHealth()
    res.status(200).json(resp)
  }

  @Post('unofficial/ask')
  async chatWithUnofficial(
    @Body() params: UnofficialChatGPTAsk,
    @Res() res: any,
  ) {
    const { prompt, conversation_id, parent_id } = params
    assert.ok(
      prompt.trim(),
      new BadRequestException(`Invalid prompt: ${prompt}`),
    )
    const jobId = await this.openaiService.appendUnofficial({
      prompt,
      conversation_id,
      parent_id,
    })

    res.status(200).json({ success: 200, data: { jobId } })
  }

  async chatWithOfficial() {}

  @Post('notify/garbage')
  receiveNotify(@Body() data: any) {
    this.logger.debug(`[notify/garbage]: ${JSON.stringify(data)}`)
  }
}
