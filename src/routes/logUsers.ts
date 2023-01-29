import { FastifyInstance } from "fastify";
import { addUser, authCallback, changeUser, getAvailableUsers } from "../controllers/logUsers";

export default async function (fastify: FastifyInstance) {
  fastify.get('/login', async (req, res) => {
    return await addUser(res)
  })

  fastify.get('/callback', async (req, res) => {
    return await authCallback(req, res)
  })

  fastify.get('/changeuser/:user', async (req) => {
    return await changeUser(req)
  })

  fastify.get('/availableusers', async () => {
    return await getAvailableUsers()
  })
}