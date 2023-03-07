import got from 'got'
import { httpsProxyAgent } from './http-proxy-agent'

export const GotClient = got.extend({
  retry: {
    limit: 2,
    methods: ['GET', 'POST'],
  },
  agent: {
    https: httpsProxyAgent,
  },
})
