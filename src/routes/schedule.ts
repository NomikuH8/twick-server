import { FastifyInstance } from 'fastify'
import { addNewScheduled, getAllScheduled, scheduleImages } from '../controllers/schedule'
import { NewScheduleBody } from '../interfaces/NewScheduleBody'

export default async function schedule(fastify: FastifyInstance) {
  fastify.get('/schedule', async () => getAllScheduled())

  fastify.post('/schedule/images', async (req) => scheduleImages(req))

  fastify.post('/schedule', async (req) => addNewScheduled(req.body as NewScheduleBody))
}
