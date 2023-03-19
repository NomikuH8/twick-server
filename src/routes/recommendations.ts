import { FastifyInstance } from 'fastify'
import {
  approveRecommendation,
  declineRecommendation,
  getApprovedRecommendations,
  getRecommendations,
} from '../controllers/recommendations'

export default async function recommendations(fastify: FastifyInstance) {
  fastify.get('/recommendations', () => getRecommendations())

  fastify.get('/recommendations/approved', () => getApprovedRecommendations())

  fastify.get('/recommendations/approve/:id', (req) => approveRecommendation(req))

  fastify.get('/recommendations/decline/:id', (req) => declineRecommendation(req))
}
