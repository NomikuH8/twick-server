import { SystemVariables } from './entity/SystemVariables'
import getDiscordBot from './utils/getDiscordBot'
import startSchedule from './utils/startSchedule'
import { AppDataSource } from './data-source'
import setupServer from './utils/setupServer'
import getServer from './utils/getServer'
import { setFirstUser } from './controllers/logUsers'

AppDataSource.initialize()
  .then(async () => {
    let firstRun = false
    let server = await AppDataSource.manager.findOneBy(SystemVariables, {
      name: 'SERVER',
    })
    if (!server) {
      firstRun = true
      await setupServer()
      server = await AppDataSource.manager.findOneBy(SystemVariables, {
        name: 'SERVER',
      })
    }

    // starting server
    const app = await getServer()
    await startSchedule()
    // starting bot, making it here for localization purposes
    app.register(getDiscordBot)

    const { port, host } = server.value
    app.listen({ port, host }, (err) => {
      if (err) {
        console.error(err)
        process.exit(1)
      }

      if (!firstRun) console.log(`Running server in http://${host}:${port}`)
      else console.log(`Running server in http://${host}:${port}/setvarsys`)

      setFirstUser()
    })
  })
  .catch((error) => console.log(error))
