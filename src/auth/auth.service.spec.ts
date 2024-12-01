// sportifs-events-nest-js\src\auth\auth.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../users/user.model';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

describe('AuthService', () => {
  let authService: AuthService;
  let userModel: Model<User>;
  let jwtService: JwtService;

  const mockUser = {
    _id: 'someId',
    email: 'test@example.com',
    username: 'testuser',
    password: 'hashedPassword',
    roles: ['user']
  };

  const mockUserModel = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    constructor: jest.fn().mockImplementation((data) => ({
      ...data,
      save: jest.fn().mockResolvedValue(data),
    })),
  };

  mockUserModel.create.mockResolvedValue({
    username: 'testuser',
    email: 'test@example.com',
    password: 'hashedPassword',
    save: jest.fn().mockResolvedValue(mockUser),
  });
  
  

  const mockJwtService = {
    signAsync: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userModel = module.get<Model<User>>(getModelToken(User.name));
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('signup', () => {
    it('should successfully create a new user', async () => {
      // Arrange
      const email = 'test@example.com';
      const password = 'password123';
      const username = 'testuser';
      
      mockUserModel.findOne.mockResolvedValue(null);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword' as never);
      mockUserModel.create.mockResolvedValue({
        ...mockUser,
        save: jest.fn().mockResolvedValue(mockUser)
      });

      // Act
      const result = await authService.signup(email, password, username);

      // Assert
      expect(result).toEqual({ message: 'Registration successful' });
      expect(mockUserModel.findOne).toHaveBeenCalledWith({ email });
      expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
      expect(mockUserModel.create).toHaveBeenCalledWith({
        email,
        username,
        password: 'hashedPassword'
      });
    });

    it('should throw ConflictException if user already exists', async () => {
      // Arrange
      const email = 'test@example.com';
      mockUserModel.findOne.mockResolvedValue(mockUser);

      // Act & Assert
      await expect(
        authService.signup(email, 'password123', 'testuser'),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('signin', () => {
    it('should successfully sign in a user', async () => {
      // Arrange
      const email = 'test@example.com';
      const password = 'password123';
      const accessToken = 'jwt-token';

      mockUserModel.findOne.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);
      mockJwtService.signAsync.mockResolvedValue(accessToken);

      // Act
      const result = await authService.signin(email, password);

      // Assert
      expect(result).toEqual({
        user: {
          id: mockUser._id,
          username: mockUser.username,
          email: mockUser.email,
          roles: mockUser.roles,
        },
        access_token: accessToken,
      });
      expect(mockUserModel.findOne).toHaveBeenCalledWith({ email });
      expect(bcrypt.compare).toHaveBeenCalledWith(password, mockUser.password);
      expect(mockJwtService.signAsync).toHaveBeenCalledWith(
        { sub: mockUser._id, email: mockUser.email },
        { secret: process.env.JWT_SECRET, expiresIn: '2h' },
      );
    });

    it('should throw UnauthorizedException if user not found', async () => {
      // Arrange
      mockUserModel.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(
        authService.signin('nonexistent@example.com', 'password123'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password is incorrect', async () => {
      // Arrange
      mockUserModel.findOne.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

      // Act & Assert
      await expect(
        authService.signin('test@example.com', 'wrongpassword'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});