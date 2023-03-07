import { NestFactory } from '@nestjs/core'
import { NextFunction, Request, Response } from 'express'
import { AppModule } from './app.module'

function HealthMiddleware(req: Request, res: Response, next: NextFunction) {
  if (req.path !== '/health') {
    return next()
  }
  res.json({ success: true })
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.use(HealthMiddleware)

  await app.listen(3000)
}
bootstrap()
