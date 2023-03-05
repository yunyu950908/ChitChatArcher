import { Test, TestingModule } from '@nestjs/testing'
import { CqhttpController } from './cqhttp.controller'

describe('CqhttpController', () => {
  let controller: CqhttpController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CqhttpController],
    }).compile()

    controller = module.get<CqhttpController>(CqhttpController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
