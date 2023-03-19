import { FastifyRequest } from 'fastify'
import { unlinkSync } from 'fs'
import { join } from 'path'
import { Recommendation } from '../entity/Recommendation'
import { AppDataSource } from '../data-source'
import { getImagePath } from '../utils/paths'

export async function getRecommendations() {
  return AppDataSource.manager.find(Recommendation, {
    relations: {
      recommender: true,
    },
    where: {
      approved: false,
    },
  })
}

export async function getApprovedRecommendations() {
  return AppDataSource.manager.find(Recommendation, {
    relations: {
      recommender: true,
    },
    where: {
      approved: true,
    },
  })
}

export async function approveRecommendation(req: FastifyRequest) {
  const params = req.params as { id: number }
  const recom = await AppDataSource.manager.findOneBy(Recommendation, {
    id: params.id,
  })

  recom.approved = true
  return AppDataSource.manager.save(recom)
}

export async function declineRecommendation(req: FastifyRequest) {
  const params = req.params as {id: number}
  const recom = await AppDataSource.manager.findOneBy(Recommendation, {
    id: params.id,
  })

  unlinkSync(join(getImagePath().recommendations, recom.filename))
  return AppDataSource.manager.remove(recom)
}
