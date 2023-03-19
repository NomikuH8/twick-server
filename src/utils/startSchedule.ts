import { scheduleJob } from 'node-schedule'

import { ScheduledPost } from '../entity/ScheduledPost'
import { AppDataSource } from '../data-source'
import { tweet } from '../controllers/twitter'

export default async function startSchedule() {
  const scheduled = await AppDataSource.manager.find(ScheduledPost)
  for (const i of scheduled) {
    scheduleJob(`schedule-${i.id}`, i.timestamp, async () => {
      await tweet(i.text, i.images)
      await AppDataSource.manager.remove(i)
    })
    if (+i.timestamp < +new Date()) {
      await tweet(i.text, i.images)
      await AppDataSource.manager.remove(i)
    }
  }
}
