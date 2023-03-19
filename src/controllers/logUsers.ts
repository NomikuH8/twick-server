import { FastifyReply, FastifyRequest } from 'fastify'
import { TwitterApi } from 'twitter-api-v2'
import { SystemVariables } from '../entity/SystemVariables'
import { LoggedUser } from '../entity/LoggedUser'
import { AppDataSource } from '../data-source'

export async function addUser(res: FastifyReply) {
  const newUser = new LoggedUser()
  const twitterVars = await AppDataSource.manager.findOneBy(SystemVariables, {
    name: 'TWITTER',
  })

  globalThis.currentClient = new TwitterApi({
    appKey: twitterVars.value.consumer_key,
    appSecret: twitterVars.value.consumer_secret,
  })

  const authUrl = await globalThis.currentClient.generateAuthLink(
    twitterVars.value.callback,
  )

  newUser.access_token = authUrl.oauth_token
  newUser.access_token_secret = authUrl.oauth_token_secret
  await AppDataSource.manager.save(newUser)
  globalThis.addedUserId = newUser.id

  res.redirect(authUrl.url)
}

export async function authCallback(req: FastifyRequest, res: FastifyReply) {
  const { oauth_token, oauth_verifier } = req.query as any

  const twitterVars = await AppDataSource.manager.findOneBy(SystemVariables, {
    name: 'TWITTER',
  })

  const newUser = await AppDataSource.manager.findOneBy(LoggedUser, {
    id: globalThis.addedUserId,
  })

  globalThis.currentClient = new TwitterApi({
    appKey: twitterVars.value.consumer_key,
    appSecret: twitterVars.value.consumer_secret,
    accessToken: oauth_token,
    accessSecret: newUser.access_token_secret,
  })

  const newClient = await globalThis.currentClient.login(oauth_verifier)
  newUser.access_token = newClient.accessToken
  newUser.access_token_secret = newClient.accessSecret
  newUser.screen_name = newClient.screenName
  newUser.twitter_id = newClient.userId

  try {
    await AppDataSource.manager.save(newUser)
  } catch (err) {
    // in case user already exists
    await AppDataSource.manager.remove(newUser)
    res.redirect('/')
    return
  }

  globalThis.currentClient = newClient.client
  res.redirect('/')
}

export async function getUser() {
  const loggeduser = await globalThis.currentClient.currentUser()
  const user = await AppDataSource.manager.findOneBy(LoggedUser, {
    screen_name: loggeduser.screen_name,
  })
  user.banner_image_link = loggeduser.profile_banner_url
  user.profile_picture_link = loggeduser.profile_image_url_https
  user.name = loggeduser.name
  loggeduser.id = user.id

  return loggeduser
}

export async function setFirstUser() {
  const gotUser = await AppDataSource.manager.find(LoggedUser)
  const twitterVars = await AppDataSource.manager.findOneBy(SystemVariables, {
    name: 'TWITTER',
  })

  if (!gotUser) { return }

  globalThis.currentClient = new TwitterApi({
    appKey: twitterVars.value.consumer_key,
    appSecret: twitterVars.value.consumer_secret,
    accessToken: gotUser[0].access_token,
    accessSecret: gotUser[0].access_token_secret,
  })

  // return globalThis.currentClient.currentUser()
}

export async function changeUser(req: FastifyRequest) {
  const { user } = req.params as { user: number }
  const gotUser = await AppDataSource.manager.findOneBy(LoggedUser, {
    id: user,
  })
  const twitterVars = await AppDataSource.manager.findOneBy(SystemVariables, {
    name: 'TWITTER',
  })

  if (!gotUser) { return }

  globalThis.currentClient = new TwitterApi({
    appKey: twitterVars.value.consumer_key,
    appSecret: twitterVars.value.consumer_secret,
    accessToken: gotUser.access_token,
    accessSecret: gotUser.access_token_secret,
  })
}

export async function getAvailableUsers() {
  const obj = []
  for (const i of await AppDataSource.manager.find(LoggedUser)) {
    const a: any = {}
    a.id = i.id
    a.name = i.name
    a.screen_name = i.screen_name
    a.banner_image_link = i.banner_image_link
    a.profile_picture_link = i.profile_picture_link
    a.twitter_id = i.twitter_id
    obj.push(a)
  }
  return obj
}

export async function removeUser() {

}
