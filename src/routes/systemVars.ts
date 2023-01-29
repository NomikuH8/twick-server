import { getVariables, setVariables } from "../controllers/systemVars"
import { FastifyInstance } from "fastify"

export default async function (fastify: FastifyInstance) {
  fastify.get('/vars', async () => {
    return await getVariables()
  })

  fastify.post('/vars', async (req) => {
    return await setVariables(req)
  })
}