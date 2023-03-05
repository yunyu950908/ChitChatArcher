import { Test, TestingModule } from '@nestjs/testing'
import { validate } from 'uuid'
import { OpenaiService } from './openai.service'

describe('OpenaiService', () => {
  let service: OpenaiService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OpenaiService],
    }).compile()

    service = module.get<OpenaiService>(OpenaiService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  if (process.env.UNOFFICIAL_CHATGPT_API) {
    it('should success call health api', async () => {
      const { success } = await service.unofficialChatGPTHealth()
      expect(success).toBe(true)
    })

    it('should success call auth api ', async () => {
      const { success } = await service.unofficialChatGPTAuth()
      expect(success).toBe(true)
    })

    it('should success call ask api ', async () => {
      const { success, data } = await service.unofficialChatGPTAsk({
        prompt: '你好',
      })
      const { message, conversation_id, parent_id } = data
      expect(success).toBe(true)
      expect(typeof message === 'string').toBeTruthy()
      expect(validate(conversation_id)).toBeTruthy()
      expect(validate(parent_id)).toBeTruthy()
    })
  }
})
