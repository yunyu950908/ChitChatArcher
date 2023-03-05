import { Test, TestingModule } from '@nestjs/testing'
import { CqhttpService } from './cqhttp.service'

describe('CqhttpService', () => {
  let service: CqhttpService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CqhttpService],
    }).compile()

    service = module.get<CqhttpService>(CqhttpService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
