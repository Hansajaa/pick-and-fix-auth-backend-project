import { Injectable, NestMiddleware } from '@nestjs/common'
import { CryptoService } from '../../services/crypto.service'

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private cryptoService: CryptoService) {}

  use(req: any, res: any, next: () => void) {
    const encryptedKey = req.headers['auth-key']
    req.headers['auth-key'] = this.cryptoService.decrypt(encryptedKey)

    next()
  }
}
