import { SystemVariables } from "../entity/SystemVariables"
import { Recommendation } from "../entity/Recommendation"
import { CustomString } from "../entity/CustomString"
import { Recommender } from "../entity/Recommender"
import { AppDataSource } from "../data-source"
import { getImagePath } from "../utils/paths"
import { Message } from "discord.js"
import download from "download"
import got from "got"

interface File {
  filename: string
  url: string
  wrong: boolean
}

export async function receiveRecommendation (msg: Message) {
  const dcConfigs = await AppDataSource.manager.findOneBy(SystemVariables, {
    name: 'DISCORD'
  })
  const MAX_FILESIZE = parseInt(dcConfigs.value.max_upload_filesize)

  const user = await getUser(msg)

  const files: File[] = []
  for (let i of msg.attachments) {
    files.push({
      filename: i[1].name,
      url: i[1].url,
      wrong: i[1].size > MAX_FILESIZE
    })
  }

  for (let i of msg.embeds) {
    const url = i.url
    const filename = url.split('/').slice(-1)[0]
    const req = (await got.head(url)).headers
    files.push({
      filename,
      url,
      wrong: parseInt(req["content-length"]) > MAX_FILESIZE
    })
  }

  const setupStrings = await setupCustomStrings()

  let newAnswer = setupStrings.answer.value
  for (let file of files) {
    const ext = file.filename.split('.').slice(-1)[0]
    if (
      !dcConfigs.value.allowed_file_extensions.includes(ext) ||
      ext.length > 4
    )
      file.wrong = true

    newAnswer += !file.wrong ?
      setupStrings.right.value.replace('%filename%', file.filename)
      :
      setupStrings.wrong.value.replace('%filename%', file.filename)

    if (file.wrong)
      continue

    file.filename = `${new Date().getMilliseconds()}-${file.filename}`
    download(file.url, getImagePath().recommendations, {
      filename: file.filename
    })

    const newRecommendation = new Recommendation()
    newRecommendation.filename = file.filename
    newRecommendation.approved = false
    newRecommendation.recommender = user
    newRecommendation.datetime = new Date(msg.createdTimestamp)
    await AppDataSource.manager.save(newRecommendation)
  }

  newAnswer += setupStrings.end.value
  if (newAnswer) msg.channel.send(newAnswer)
}

async function getUser (msg: Message): Promise<Recommender> {
  let existsRecommender = await AppDataSource.manager.findOneBy(Recommender, {
    discord_ping: msg.author.toString()
  })

  if (!existsRecommender) {
    existsRecommender = new Recommender()
    existsRecommender.discord = msg.author.tag
    existsRecommender.discord_ping = msg.author.toString()
    await AppDataSource.manager.save(existsRecommender)
  }

  return existsRecommender
}

async function setupCustomStrings () {
  let answer = await AppDataSource.manager.findOneBy(CustomString, {
    name: 'list_recommendations_start'
  })
  let right = await AppDataSource.manager.findOneBy(CustomString, {
    name: 'list_recommendations_right'
  })
  let wrong = await AppDataSource.manager.findOneBy(CustomString, {
    name: 'list_recommendations_wrong'
  })
  let end = await AppDataSource.manager.findOneBy(CustomString, {
    name: 'list_recommendations_end'
  })
  if (!answer) {
    answer = new CustomString()
    answer.name = 'list_recommendations_start'
    answer.value = 'How your recommendations went:\n'
    await AppDataSource.manager.save(answer)
  }
  if (!right) {
    right  = new CustomString()
    right.name = 'list_recommendations_right'
    right.value = '🟢 %filename%\n'
    await AppDataSource.manager.save(right)
  }
  if (!wrong) {
    wrong = new CustomString()
    wrong.name = 'list_recommendations_wrong'
    wrong.value = '🔴 %filename%\n'
    await AppDataSource.manager.save(wrong)
  }
  if (!end) {
    end = new CustomString()
    end.name = 'list_recommendations_end'
    end.value = 'Thanks for them'
    await AppDataSource.manager.save(end)
  }

  return {
    answer,
    right,
    wrong,
    end
  }
}