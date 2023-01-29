import { TwitterApi } from "twitter-api-v2";

declare global {
  var currentClient: TwitterApi
  var addedUserId: number
}