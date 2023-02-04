import { receiveRecommendation } from "./recommendations"
import { Client, Message } from "discord.js"
import { argv } from "process"

export class DiscordBot {
  private allowedRecChannels: string[]
  private allowedChannels: string[]
  private client: Client
  private token: string
  private config: any

  constructor(config: any) {
    this.config = config

    if (!this.config.enabled)
      return
  
    this.token = this.config.token
    this.allowedChannels = this.config.allowed_channels
  
    this.client = new Client({
      intents: ["Guilds", "GuildMembers", "GuildMessages", "MessageContent"]
    })
  
    this.setupActions()
    this.start()
  }
  
  getStatus() {
    const uptime = this.client.uptime.toString()
    return {
      currentTag: this.client.user.tag,
      running: Boolean(uptime),
      uptime
    }
  }

  async start() {
    await this.client.login(this.token)
  }

  async restart() {
    this.stop()
    await this.start()
  }

  stop() {
    this.client.destroy()
  }

  private setupActions() {
    this.client.on("ready", () => {
      console.log(`Discord bot running as ${this.client.user.tag}`)
    })

    this.client.on("messageCreate", async (msg) => {
      if (msg.author.bot) return

      const channelName = (msg.channel.toJSON() as any).name
      if (!this.allowedChannels.includes(channelName)) return
      const command = this.getCommand(msg)

      if (
        this.allowedRecChannels.includes(channelName) &&
        (msg.attachments.first() || msg.embeds.length)
      ) {
        await receiveRecommendation(msg)
      }

      if (!command) return
    })
  }

  private getCommand(msg: Message) {
    if (msg.author.bot) return false
    if (!msg.content.startsWith(this.config.prefix)) return false

    return msg.content.slice(msg.content.indexOf(this.config.prefix))
  }
}

let config = ''
for (let i of argv.slice(2)) {
  config += i
}

const bot = new DiscordBot(JSON.parse(config))
process.on("message", (msg: "start" | "stop" | "restart" | "info") => {
  if (msg === "start") bot.start()
  if (msg === "stop") bot.stop()
  if (msg === "restart") bot.restart()
  if (msg === "info") {
    process.send(bot.getStatus())
    return
  }
})
