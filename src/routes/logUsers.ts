import { FastifyInstance } from 'fastify'
import {
  addUser, authCallback, changeUser, getAvailableUsers, getUser, removeUser,
} from '../controllers/logUsers'

export default async function logUsers(fastify: FastifyInstance) {
  fastify.get('/login', async (req, res) => addUser(res))

  fastify.get('/callback', async (req, res) => authCallback(req, res))

  fastify.get('/changeuser/:user', async (req) => changeUser(req))

  fastify.get('/availableusers', async () => getAvailableUsers())

  fastify.get('/currentuser', async () => getUser())

  fastify.get('/removeuser', async () => removeUser())
}
