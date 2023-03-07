import { HttpsProxyAgent } from 'hpagent'

export const httpsProxyAgent = process.env.HTTPS_PROXY_AGENT
  ? new HttpsProxyAgent({
      keepAlive: true,
      timeout: 30000,
      keepAliveMsecs: 5000,
      maxSockets: 256,
      maxFreeSockets: 256,
      scheduling: 'lifo',
      proxy: process.env.HTTPS_PROXY_AGENT,
    })
  : null
