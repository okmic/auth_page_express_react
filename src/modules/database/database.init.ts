import { logger } from "../logger/logger.service"
import databaseService from "./database.service"

export async function initializeDatabase() {
  logger.info(`Connecting to MongoDB at ${new Date()}`)
  await databaseService.connect()
}