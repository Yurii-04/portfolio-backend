import { Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { Order } from '~/common/enums';

export class PageOptionsDto {
  @IsEnum(Order)
  @IsOptional()
  readonly order?: Order = Order.ASC;
  
  @IsString()
  @IsOptional()
  readonly orderBy?: string = 'createdAt';

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  readonly page?: number = 1;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  @IsOptional()
  readonly take?: number = 20;

  @IsBoolean()
  @IsOptional()
  readonly all?: boolean = false;

  get skip(): number {
    return ((this.page ?? 1) - 1) * (this.take ?? 10);
  }
}