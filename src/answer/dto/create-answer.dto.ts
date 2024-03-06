import { ApiProperty } from '@nestjs/swagger';
export class CreateAnswerDto {
  @ApiProperty()
  userId: number;

  @ApiProperty()
  quetionId: number;

  @ApiProperty()
  answer: string;

  @ApiProperty()
  create_time: string;
}
