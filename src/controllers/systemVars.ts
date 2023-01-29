import { SetVariablesBody } from "../interfaces/SetVariableBody"
import { SystemVariables } from "../entity/SystemVariables"
import { AppDataSource } from "../data-source"
import { FastifyRequest } from "fastify"



export async function getVariables() {
  const varsys = await AppDataSource.manager.find(SystemVariables)
  const returned = {}

  for (let i of varsys)
    returned[i.name.toLowerCase()] = i.value

  return returned
}

export async function setVariables(req: FastifyRequest) {
  const body = req.body as SetVariablesBody

  const twitter = new SystemVariables('TWITTER', {
    consumer_key: body.twitter.consumer_key,
    consumer_secret: body.twitter.consumer_secret,
    callback: body.twitter.callback
  })
  await AppDataSource.manager.save(twitter)

  const discord = new SystemVariables('DISCORD', {
    enabled: body.discord.enabled,
    token: body.discord.token,
    prefix: body.discord.prefix,
    max_upload_filesize: 1024 * 1024 * 5, // 5mb is the max for twitter
    allowed_file_extensions: ['png', 'jpg', 'jpeg', 'gif', 'webp', 'mp4'],
    allowed_channels: body.discord.allowed_channels
  })
  await AppDataSource.manager.save(discord)

  if (twitter && discord)
    return { message: 'Saved successfully', success: true }
  else
    return { message: 'Problems saving variables', success: false }
}