import { existsSync, readFile as rf } from 'fs'
import { promisify } from 'util'

const promisifiedReadFile = promisify(rf)

export const readFile = async (path: string, type: string = 'utf-8') => {
  if (existsSync(path)) {
    const contents: string = await promisifiedReadFile(path, type)

    return JSON.parse(contents)
  }

  return []
}

export { existsSync } from 'fs'
