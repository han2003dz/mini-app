import { User } from '@app/index-entity';
import { UserService } from '@app/user';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';

type ExtendedRequest = Request & { user: User };

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private userService: UserService) {}

  async use(req: ExtendedRequest, res: Response, next: NextFunction) {
    // req.user = await this.userService.getCurrentUser(req.headers.authorization);
    next();
  }
}
