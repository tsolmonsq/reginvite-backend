import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/entities/user.entity';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { Organizer } from 'src/organizers/entities/organizer.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,

    @InjectRepository(Organizer)
    private organizerRepo: Repository<Organizer>,

    private jwtService: JwtService,
  ) {}

  async signup(dto: SignupDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = this.userRepo.create({ ...dto, password: hashedPassword });
    const savedUser = await this.userRepo.save(user);
    
    await this.organizerRepo.save({ user: savedUser });

    const { password, ...result } = savedUser;
    return result;
  }

  async login(dto: LoginDto) {
    const user = await this.userRepo.findOne({ where: { email: dto.email } });
  
    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('И-мэйл эсвэл нууц үг буруу байна');
    }
  
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
  
    const access_token = await this.jwtService.signAsync(payload);
    const { password, ...result } = user;
  
    return {
      message: 'Нэвтэрсэн',
      access_token, 
      user: result,
    };
  }  
}
