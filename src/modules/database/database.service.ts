import mongoose from 'mongoose'
import appConfig from '../../libs/config/appConfig'
import { logger } from '../logger/logger.service'

class DatabaseService {
  private uri: string = appConfig.mongoUri
  private dbName: string = appConfig.mongoDBName
  private connectionPromise: Promise<void> | null = null

  constructor() {
    mongoose.set('strictQuery', false)
  }

  public async connect(): Promise<void> {
    if (this.connectionPromise) {
      logger.debug('[Database] Connection already in progress, awaiting existing promise')
      return this.connectionPromise
    }

    this.connectionPromise = new Promise(async (resolve, reject) => {
      const startTime = Date.now()
      
      try {
        const maskedUri = this.uri.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@')
        
        logger.info('[Database] Establishing connection to MongoDB', {
          dbName: this.dbName,
          uri: maskedUri
        })

        await mongoose.connect(this.uri, {
          maxPoolSize: 10,
          serverSelectionTimeoutMS: 10000
        })

        const duration = Date.now() - startTime

        logger.info('[Database] MongoDB connection established successfully', {
          dbName: this.dbName,
          durationMs: duration,
          readyState: mongoose.connection.readyState,
          host: mongoose.connection.host,
          port: mongoose.connection.port
        })

        this.setupConnectionListeners()
        resolve()
      } catch (error) {
        const duration = Date.now() - startTime
        const errorMessage = error instanceof Error ? error.message : String(error)
        
        logger.error('[Database] MongoDB connection failed', {
          dbName: this.dbName,
          durationMs: duration,
          error: errorMessage
        })
        reject(error)
      }
    })

    return this.connectionPromise
  }

  private setupConnectionListeners(): void {
    mongoose.connection.on('connected', () => {
      logger.info('[Database] MongoDB connection established', {
        dbName: this.dbName,
        host: mongoose.connection.host,
        port: mongoose.connection.port
      })
    })

    mongoose.connection.on('error', (error) => {
      logger.error('[Database] MongoDB connection error', {
        dbName: this.dbName,
        error: error instanceof Error ? error.message : String(error)
      })
    })

    mongoose.connection.on('disconnected', () => {
      logger.warn('[Database] MongoDB disconnected', {
        dbName: this.dbName
      })
    })

    mongoose.connection.on('reconnected', () => {
      logger.info('[Database] MongoDB reconnected', {
        dbName: this.dbName
      })
    })
  }

  public async getDb(): Promise<mongoose.mongo.Db> {
    if (!this.isConnected()) {
      logger.debug('[Database] No active connection, establishing...')
      await this.connect()
    }
    
    const db = mongoose.connection.db
    if (!db) {
      throw new Error('[Database] MongoDB connection not established')
    }
    
    return db
  }

  public async close(): Promise<void> {
    const startTime = Date.now()
    
    try {
      logger.info('[Database] Closing MongoDB connections', {
        dbName: this.dbName,
        currentState: this.getConnectionStateString()
      })

      await mongoose.disconnect()
      this.connectionPromise = null

      const duration = Date.now() - startTime
      logger.info('[Database] MongoDB connections closed successfully', {
        dbName: this.dbName,
        durationMs: duration
      })
    } catch (error) {
      const duration = Date.now() - startTime
      const errorMessage = error instanceof Error ? error.message : String(error)
      logger.error('[Database] Error closing MongoDB connections', {
        dbName: this.dbName,
        durationMs: duration,
        error: errorMessage
      })
      throw error
    }
  }

  public isConnected(): boolean {
    return mongoose.connection.readyState === 1
  }

  private getConnectionStateString(): string {
    const states: Record<number, string> = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting',
      99: 'uninitialized'
    }
    return states[mongoose.connection.readyState] || 'unknown'
  }

  public getConnectionInfo(): object {
    return {
      isConnected: this.isConnected(),
      readyState: this.getConnectionStateString(),
      dbName: this.dbName,
      host: mongoose.connection.host,
      port: mongoose.connection.port,
      models: Object.keys(mongoose.models)
    }
  }
}

export default new DatabaseService()
