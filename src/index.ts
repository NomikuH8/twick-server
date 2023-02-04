import { SystemVariables } from "./entity/SystemVariables"
import getDiscordBot from "./utils/getDiscordBot"
import { AppDataSource } from "./data-source"
import setupServer from "./utils/setupServer"
import getServer from "./utils/getServer"

AppDataSource.initialize().then(async () => {

  let server = await AppDataSource.manager.findOneBy(SystemVariables, {
    name: 'SERVER'
  })
  if (!server) {
    await setupServer()
    server = await AppDataSource.manager.findOneBy(SystemVariables, {
      name: 'SERVER'
    })
  }

  // starting server
  const app = await getServer()
  // starting bot, making it here for localization purposes
  app.register(getDiscordBot)

  const port = server.value.port
  const host = server.value.host
  app.listen({ port, host }, (err) => {
    if (err) {
      console.error(err)
      process.exit(1)
    }

    console.log(`Running server in http://${host}:${port}`)
  })
}).catch(error => console.log(error))
