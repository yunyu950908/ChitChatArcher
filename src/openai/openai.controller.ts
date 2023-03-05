import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Res,
} from '@nestjs/common'
import * as assert from 'assert'
import { OpenaiService, UnofficialChatGPTAsk } from './openai.service'

@Controller('openai')
export class OpenaiController {
  constructor(private readonly openaiService: OpenaiService) {}

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
}
