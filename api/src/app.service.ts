import { Injectable } from '@nestjs/common'

@Injectable()
export class AppService {
  health() {
    return 'Fetcher api'
  }
}
