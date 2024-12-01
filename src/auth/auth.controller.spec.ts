import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  // Mock AuthService
  const mockAuthService = {
    signup: jest.fn(),
    signin: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signup', () => {
    it('should call authService.signup with correct parameters', async () => {
      const signupDto = {
        email: 'test@example.com',
        password: 'password123',
        username: 'testuser',
      };

      await controller.signup(signupDto);

      expect(authService.signup).toHaveBeenCalledWith(
        signupDto.email,
        signupDto.password,
        signupDto.username,
      );
    });
  });

  describe('signin', () => {
    it('should call authService.signin with correct parameters', async () => {
      const signinDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      await controller.signin(signinDto);

      expect(authService.signin).toHaveBeenCalledWith(
        signinDto.email,
        signinDto.password,
      );
    });
  });
});