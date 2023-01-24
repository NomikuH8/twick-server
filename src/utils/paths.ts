import { resolve } from "path"
import { cwd } from "process"

export function getDataPath() {
  const root = resolve(cwd(), 'data')
  return {
    root,
    configs: resolve(root, 'configs'),
    dist: resolve(root, 'dist'),
    images: resolve(root, 'images')
  }
}

export function getImagePath() {
  const root = getDataPath().images
  return {
    approved: resolve(root, 'approved'),
    recommendations: resolve(root, 'recommendations'),
    scheduled: resolve(root, 'scheduled'),
    temp: resolve(root, 'temp')
  }
}
