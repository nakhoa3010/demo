import { Injectable } from '@nestjs/common'

@Injectable()
export class AppService {
  root() {
    return 'X Oracle Open API'
  }
  health(): string {
    return 'OK'
  }
}
