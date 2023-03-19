import { copyFile, unlink, writeFile } from 'fs/promises'
import { scheduleJob } from 'node-schedule'
import { FastifyRequest } from 'fastify'
import { join } from 'path'

import { NewScheduleBody } from '../interfaces/NewScheduleBody'
import { Recommendation } from '../entity/Recommendation'
import { ScheduledPost } from '../entity/ScheduledPost'
import { AppDataSource } from '../data-source'
import { getImagePath } from '../utils/paths'
import { tweet } from './twitter'

export async function getAllScheduled() {
  return AppDataSource.manager.find(ScheduledPost)
}

export async function scheduleImages(req: FastifyRequest) {
  for await (const i of req.parts()) {
    if (!('file' in i)) {
      await copyFile(
        join(getImagePath().recommendations, i.value as string),
        join(getImagePath().scheduled, i.value as string),
      )
      await unlink(join(getImagePath().recommendations, i.value as string))
      const toRemove = await AppDataSource.manager.findOneBy(Recommendation, {
        filename: i.value as string,
      })
      await AppDataSource.manager.remove(toRemove)
      continue
    }

    await writeFile(
      join(getImagePath().scheduled, i.filename),
      await i.toBuffer(),
    )
  }

  return true
}

export async function addNewScheduled(body: NewScheduleBody) {
  const newSchedule = new ScheduledPost()
  newSchedule.text = body.text
  newSchedule.timestamp = new Date(body.timestamp)
  newSchedule.images = body.images
  await AppDataSource.manager.save(newSchedule)

  scheduleJob(`schedule-${newSchedule.id}`, newSchedule.timestamp, async () => {
    await tweet(newSchedule.text, newSchedule.images)
    await AppDataSource.manager.remove(newSchedule)
  })

  return { success: true }
}
