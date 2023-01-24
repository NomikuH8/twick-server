import { fastifyMultipart } from "@fastify/multipart";
import { fastifyAutoload } from "@fastify/autoload";
import { fastifyStatic } from "@fastify/static";
import { fastifyCors } from "@fastify/cors";
import { fastify } from "fastify";
import { getDataPath, getImagePath } from "./paths";
import { resolve } from "path";
import { cwd } from "process";

export default async function () {
  const app = fastify({})
  app.register(fastifyCors, {
    methods: '*',
    origin: '*',
    allowedHeaders: '*',
    preflightContinue: true
  })

  app.register(fastifyMultipart, {})

  app.register(fastifyStatic, {
    root: resolve(getDataPath().dist, 'dist'),
    prefix: '/'
  })
  app.register(fastifyStatic, {
    root: getImagePath().recommendations,
    prefix: "/images/recommendations/",
    decorateReply: false
  })
  app.register(fastifyStatic, {
    root: getImagePath().approved,
    prefix: "/images/approved/",
    decorateReply: false
  })
  app.register(fastifyStatic, {
    root: getImagePath().scheduled,
    prefix: "/images/scheduled/",
    decorateReply: false
  })

  app.register(fastifyAutoload, {
    dir: resolve(cwd(), 'src', 'routes')
  })

  app.get('/', async (req, res) => {
    return res.sendFile('index.html')
  })

  return app
}
