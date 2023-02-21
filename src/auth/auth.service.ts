import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  extractAccessTokenFromHeaders(headers: Record<string, string>): string {
    const [, accessToken] = headers.authorization.split(' ');
    if (accessToken) {
      return accessToken;
    }
    throw new Error('No token found');
  }

  getSubFromAccessToken(accessToken: string): string {
    const decodedJwtAccessToken = this.jwtService.decode(accessToken);
    if (!decodedJwtAccessToken) {
      throw new Error('Token not valid');
    }
    const sub = decodedJwtAccessToken.sub;
    return sub;
  }
}
