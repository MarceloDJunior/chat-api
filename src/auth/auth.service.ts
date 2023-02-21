import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  getSubFromAccessToken(accessToken: string): string {
    const decodedJwtAccessToken = this.jwtService.decode(accessToken);
    if (!decodedJwtAccessToken) {
      throw new Error('Token not valid');
    }
    const sub = decodedJwtAccessToken.sub;
    return sub;
  }
}
