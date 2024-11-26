import { IsString, IsEmail, MinLength, MaxLength } from 'class-validator';

export class SignupDto {
  @MinLength(3, { message: 'Le nom d\'utilisateur doit avoir au moins 3 caractères' })
  @MaxLength(20, { message: 'Le nom d\'utilisateur ne doit pas dépasser 20 caractères' })
  @IsString({ message: 'Le nom d\'utilisateur doit être une chaîne de caractères' })  
  username: string;

  @IsEmail({}, { message: 'Format d\'email invalide' })
  email: string;

  @IsString({ message: 'Le mot de passe doit être une chaîne de caractères' })
  @MinLength(6, { message: 'Le mot de passe doit avoir au moins 6 caractères' })
  password: string;
}

export class SigninDto {
    @IsEmail({}, { message: "Format d\'email invalide" })
    email: string;
  
    @IsString({ message: 'Le mot de passe doit être une chaîne de caractères' })
    @MinLength(8, { message: 'Mot de passe invalide' })
    password: string;
  }
