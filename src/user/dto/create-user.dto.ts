import {
  IsNotEmpty,
  IsString,
  IsEmail,
  IsInt,
  Min,
  IsOptional,
  IsIn,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  age: number;

  @IsOptional() // Optional field; defaults to 'active' if not provided.
  @IsString()
  @IsIn(['active', 'inactive', 'banned']) // Restricting status to specific values.
  status?: string;
}
