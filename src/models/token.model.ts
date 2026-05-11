import { Schema, model, Model } from 'mongoose'

export type IToken = {
    createdAt: Date
    token: string
}

const TokenSchema = new Schema<IToken>({
  createdAt: { type: Date, default: Date.now },
  token: { type: String, required: true },
})

TokenSchema.index({ token: 1 })

interface ITokenModel extends Model<IToken> {
}

export const Token = model<IToken, ITokenModel>(
  'Token',
  TokenSchema
)
