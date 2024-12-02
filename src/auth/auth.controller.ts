// src/auth/auth.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto, SigninDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}


  
  @Post('Register')
  async signup(
    @Body() signupDto: SignupDto,
  ) {
    return this.authService.signup(signupDto.email, signupDto.password, signupDto.username);
  } 

  @Post('Login')
  async signin(
    @Body() signinDto : SigninDto,
  ) {
    return this.authService.signin(signinDto.email, signinDto.password);    
  }
}
