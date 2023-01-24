import { SystemVariables } from "../entity/SystemVariables"
import { getDataPath, getImagePath } from "./paths"
import { AppDataSource } from "../data-source"
import { existsSync, mkdirSync } from "fs"

export default async function () {

  const server = new SystemVariables('SERVER', {
    host: '0.0.0.0', // make available to lan
    port: 7278
  })
  await AppDataSource.manager.save(server)

  for (let path of Object.values(getDataPath())) {
    if (!existsSync(path)) mkdirSync(path)
  }

  for (let path of Object.values(getImagePath())) {
    if (!existsSync(path)) mkdirSync(path)
  }

  const envjson = `{
    "client_id": "your client id",
    "client_secret": "your client secret",
    "consumer_key": "your consumer key",
    "consumer_secret": "your consumer secret",
    "callback": "http://localhost:2020/callback", // use this as your callback
    "access_token": "",
    "access_secret": "",
    "tmp_auth_token": "",
    "tmp_auth_token_secret": "",
    "discord_bot_enabled": "true", // leave blank for false
    "discord_token": "",
    "discord_prefix": "",
    "max_recommendation_size": "5242880", // 5mb in bytes
    "allowed_interaction_channels": "general bot-spam media recommendations", // separated by whitespace
    "allowed_recommendation_channels": "general media recommendations", // separated by whitespace
    "allowed_file_extensions": "png jpg jpeg gif mp4 webp webm", // separated by whitespace
    "language": "en"
    // remove the comments (text marked after //)
  }`
  // TODO: create folders
}