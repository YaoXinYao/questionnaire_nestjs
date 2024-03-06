import { ApiProperty } from '@nestjs/swagger';

export class AddUserDto {
  @ApiProperty()
  username: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  code: string;
}
