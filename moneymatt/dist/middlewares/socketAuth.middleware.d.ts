import { UserDoc } from '../common/users/users.interface';
declare const socketAuthMiddleware: (token: string, authenticateAdmin?: boolean) => Promise<UserDoc | undefined>;
export default socketAuthMiddleware;
