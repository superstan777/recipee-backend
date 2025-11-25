import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid email or password');

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch)
      throw new UnauthorizedException('Invalid email or password');

    const payload = { sub: user.id, email: user.email, role: user.role };
    return this.jwtService.sign(payload);
  }

  async signup(email: string, password: string) {
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) throw new ConflictException('User already exists');

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await this.usersService.create({ email, passwordHash });

    const payload = { sub: user.id, email: user.email, role: user.role };
    return this.jwtService.sign(payload);
  }
}
