import { FastifyInstance } from "fastify"
import { fork } from "child_process"
import { resolve } from "path"
import { cwd } from "process"
import { AppDataSource } from "../data-source"
import { SystemVariables } from "../entity/SystemVariables"

export default async function (fastify: FastifyInstance) {
  const discordConfigs = await AppDataSource.manager.findOneBy(SystemVariables, {
    name: 'DISCORD'
  })
  const textConfigs = JSON.stringify(discordConfigs.value)
  const discordBot = fork(
    resolve(cwd(), 'src', 'discordBot', 'index.ts'),
    [textConfigs]
  )

  fastify.get('/discord/info', (req, res) => {
    discordBot.send('message', (msg: any) => {
      res.send(msg)
    })
    discordBot.send('info')
  })

  fastify.get('/discord/start', async () => {
    discordBot.send('start')
    return true
  })

  fastify.get('/discord/restart', async () => {
    discordBot.send('restart')
    return true
  })

  fastify.get('/discord/stop', async () => {
    discordBot.send('stop')
    return true
  })
}