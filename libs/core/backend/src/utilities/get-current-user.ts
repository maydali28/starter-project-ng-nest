import { ExecutionContext } from '@nestjs/common';

export function GetCurrentUser(context: ExecutionContext) {
  const request = context.switchToHttp().getRequest();
  // @ts-ignore
  const user: InstanceType<User> = request.user;
  return user;
}
