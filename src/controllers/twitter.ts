import { unlinkSync } from 'fs'
import { join } from 'path'
import { getImagePath } from '../utils/paths'

export async function tweet(text: string, images: string[]) {
  const media_ids = []
  for (const i of images) {
    const media_id = await globalThis.currentClient.v1.uploadMedia(
      join(getImagePath().scheduled, i),
    )
    media_ids.push(media_id)
    unlinkSync(join(getImagePath().scheduled, i))
  }

  const tweeted = await globalThis.currentClient.v1.tweet(text, {
    media_ids,
  })

  return tweeted
}
