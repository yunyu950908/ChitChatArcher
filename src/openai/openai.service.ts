import { Injectable, Logger } from '@nestjs/common'
import { HttpsProxyAgent } from 'hpagent'
import _ from 'lodash'
import moment from 'moment'
import {
  ChatCompletionRequestMessage,
  Configuration,
  CreateChatCompletionResponse,
  OpenAIApi,
} from 'openai'
import axios, { AxiosResponse } from 'axios'
import assert from 'assert'
import { validate } from 'uuid'
import { InjectQueue } from '@nestjs/bull'
import { Queue } from 'bull'
import { GotClient } from '../utils/got-client'

export interface UnofficialChatGPTAsk {
  prompt?: string
  message?: string
  conversation_id?: string
  parent_id?: string
}

interface UnofficialChatGPTResp<T = null> {
  success: boolean
  data: T
}

@Injectable()
export class OpenaiService {
  private readonly logger = new Logger(OpenaiService.name)

  private readonly apiTimeout = moment.duration(30, 'seconds').asMilliseconds()

  private readonly httpsAgent = process.env.HTTPS_PROXY_AGENT
    ? new HttpsProxyAgent({
        keepAlive: true,
        timeout: this.apiTimeout,
        keepAliveMsecs: 5000,
        maxSockets: 256,
        maxFreeSockets: 256,
        scheduling: 'lifo',
        proxy: process.env.HTTPS_PROXY_AGENT,
      })
    : null

  private readonly clients: OpenAIApi[] = []

  readonly unofficialAPI: Record<'url' | 'secret', string> = {
    url: process.env.UNOFFICIAL_CHATGPT_API,
    secret: process.env.UNOFFICIAL_CHATGPT_API_SECRET,
  }

  constructor(@InjectQueue('openai') private readonly openaiQueue: Queue) {
    const keys = (process.env.OPENAI_KEYS || '').split(',')
    for (const apiKey of keys) {
      const configuration = new Configuration({ apiKey })
      this.clients.push(new OpenAIApi(configuration))
    }
  }

  async createChatCompletion(
    messages: Array<ChatCompletionRequestMessage>,
  ): Promise<CreateChatCompletionResponse> {
    const openai = _.sample(this.clients)
    const completion = await openai.createChatCompletion(
      {
        model: 'gpt-3.5-turbo',
        messages,
      },
      { httpsAgent: this.httpsAgent },
    )
    return completion.data
  }

  async unofficialChatGPTAsk(
    params: UnofficialChatGPTAsk,
  ): Promise<UnofficialChatGPTResp<UnofficialChatGPTAsk>> {
    const url = process.env.UNOFFICIAL_CHATGPT_API + '/ask'
    const { prompt, conversation_id, parent_id } = params
    assert.ok(prompt.trim(), `Invalid prompt: ${prompt}`)
    assert.ok(
      !conversation_id || validate(conversation_id),
      `Invalid conversation_id: ${conversation_id}`,
    )
    assert.ok(
      !parent_id || validate(parent_id),
      `Invalid parent_id: ${parent_id}`,
    )
    // const { data }: AxiosResponse<UnofficialChatGPTResp<UnofficialChatGPTAsk>> =
    //   await axios.post(
    //     url,
    //     {
    //       prompt,
    //       conversation_id,
    //       parent_id,
    //     },
    //     { httpsAgent: this.httpsAgent },
    //   )
    const data = await GotClient.post(url, {
      json: {
        prompt,
        conversation_id,
        parent_id,
      },
    }).json<UnofficialChatGPTResp<UnofficialChatGPTAsk>>()
    return data
  }

  async unofficialChatGPTAuth(): Promise<UnofficialChatGPTResp> {
    const url = process.env.UNOFFICIAL_CHATGPT_API + '/auth'
    // const { data }: AxiosResponse<UnofficialChatGPTResp> = await axios.post(
    //   url,
    //   null,
    //   {
    //     httpsAgent: this.httpsAgent,
    //   },
    // )
    const data = await GotClient.post(url).json<UnofficialChatGPTResp>()
    return data
  }

  async unofficialChatGPTHealth(): Promise<UnofficialChatGPTResp> {
    const url = process.env.UNOFFICIAL_CHATGPT_API + '/health'
    const { data }: AxiosResponse<UnofficialChatGPTResp> = await axios.get(url)
    // const data = await GotClient.get(url).json<UnofficialChatGPTResp>()
    return data
  }

  async appendUnofficial(
    params: UnofficialChatGPTAsk & { userId?: string; notifyURL?: string },
  ) {
    const {
      userId = 'guest',
      notifyURL = 'http://localhost:3000/openai/notify/garbage',
      prompt,
      conversation_id,
      parent_id,
    } = params
    const result = await this.openaiQueue.add('unofficial', {
      userId,
      notifyURL,
      prompt,
      conversation_id,
      parent_id,
    })
    this.logger.debug(`returned from add job: ${result.id}`)
    return result.id
  }

  async appendOfficial() {}
}
