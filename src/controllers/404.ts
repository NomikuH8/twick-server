import { FastifyReply, FastifyRequest } from "fastify";

export async function handler404(req: FastifyRequest, res: FastifyReply) {
  return res.sendFile('index.html')
}