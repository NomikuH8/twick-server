import { FastifyInstance } from 'fastify'
import { tweet } from '../controllers/twitter'

interface BodyTweet {
  text: string
  images: string[]
}

export default async function twitter(fastify: FastifyInstance) {
  fastify.post('/twitter/tweet', async (req) => {
    const body = req.body as BodyTweet
    return tweet(body.text, body.images)
  })
}
