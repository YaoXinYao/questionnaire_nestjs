import { ApiProperty } from '@nestjs/swagger';

export class PasswordUserDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  password: string;

  @ApiProperty()
  code: string;
}
