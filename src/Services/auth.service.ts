import * as bcrypt from 'bcrypt';

export class AuthService {
  constructor() {}

  async encryptPass(password: string): Promise<string> {
      const saltOrRounds = 10;
      return await bcrypt.hash(password, saltOrRounds);
  }

  async compareHash(password: string, hash: string): Promise<Boolean> {
    return await bcrypt.compare(password, hash);
  }
  
}