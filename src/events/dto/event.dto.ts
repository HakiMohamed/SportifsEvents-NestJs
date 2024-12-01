import { 
    IsString, 
    IsDate, 
    IsNumber, 
    ValidateNested, 
    IsOptional, 
    IsEmail, 
    IsPhoneNumber 
  } from 'class-validator';
  import { Type } from 'class-transformer';

  export class ParticipantDto {
    @IsString()
    fullName: string;
  
    @IsEmail()
    email: string;
  
    @IsOptional()
    @IsPhoneNumber()
    phone?: string;
  }
  
  export class CreateEventDto {
    @IsString()
    name: string;
  
    @IsString()
    description: string;
  
    @IsDate()
    @Type(() => Date)
    date: Date;
  
    @IsString()
    location: string;
  
    @IsOptional()
    @IsNumber()
    maxParticipants?: number = 50;

    @IsOptional()
    @IsString({ each: true })
    images?: string[];
  }

  export class UpdateEventDto {
    @IsOptional()
    @IsString()
    name?: string;
  
    @IsOptional()
    @IsString()
    description?: string;
  
    @IsOptional()
    @IsDate()
    @Type(() => Date)
    date?: Date;
  
    @IsOptional()
    @IsString()
    location?: string;
  
    @IsOptional()
    @IsNumber()
    maxParticipants?: number;

    @IsOptional()
    @IsString({ each: true })
    images?: string[];
  }
  
  export class AddParticipantDto {
    @IsString()
    fullName: string;
  
    @IsEmail()
    email: string;
  
    @IsOptional()
    phone?: string;
  }