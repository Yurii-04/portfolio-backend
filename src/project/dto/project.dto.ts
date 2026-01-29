import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayNotEmpty,
  IsArray, IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';

export class ImageDto {
  @IsUrl()
  url: string;

  @IsString()
  @IsNotEmpty()
  alt: string;
}

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  technologies: string[];

  @IsUrl()
  @IsOptional()
  liveUrl?: string;

  @IsUrl()
  @IsOptional()
  githubUrl?: string;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMaxSize(20, { message: 'Maximum 20 images allowed' })
  @ValidateNested({ each: true })
  @Type(() => ImageDto)
  images: ImageDto[];

  @IsInt()
  @Min(0)
  coverIndex: number;

  @IsArray()
  @IsString({ each: true })
  @ArrayNotEmpty()
  features: string[];

  @IsString()
  @MinLength(10)
  aboutProject: string;

  @IsString()
  @IsNotEmpty()
  role: string;

  @IsDateString()
  date: string;
}

export class UpdateProjectDto extends PartialType(CreateProjectDto) {
}
