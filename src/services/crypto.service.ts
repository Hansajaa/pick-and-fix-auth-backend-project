import { Injectable } from '@nestjs/common'
import * as crypto from 'crypto'
import * as dotenv from 'dotenv'

dotenv.config()

@Injectable()
export class CryptoService {
  private readonly algorithm = 'aes-256-cbc'
  private secretKey: Buffer
  private iv: Buffer

  constructor() {
    const secretKeyHex = process.env.AES_SECRET_KEY
    const ivHex = process.env.AES_IV
    if (!secretKeyHex || !ivHex) {
      throw new Error(
        'Secret key or IV is not defined in environment variables.',
      )
    }
    this.secretKey = Buffer.from(secretKeyHex, 'hex')
    this.iv = Buffer.from(ivHex, 'hex')
  }

  encrypt(text: string): string {
    const cipher = crypto.createCipheriv(
      this.algorithm,
      this.secretKey,
      this.iv,
    )
    let encrypted = cipher.update(text, 'utf8', 'hex')
    encrypted += cipher.final('hex')
    return encrypted
  }

  decrypt(encryptedText: string): string {
    const decipher = crypto.createDecipheriv(
      this.algorithm,
      this.secretKey,
      this.iv,
    )
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8')
    decrypted += decipher.final('utf8')
    return decrypted
  }
}
