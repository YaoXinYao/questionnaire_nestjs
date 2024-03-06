import { ApiProperty } from '@nestjs/swagger';

export class AddAnswerDto {
  @ApiProperty()
  userId: number;

  @ApiProperty()
  qId: number;

  @ApiProperty({
    type: () => Object,
    isArray: true,
    example: [{ questionId: 1, answer: 'Example answer' }],
  })
  answerList: Array<{ questionId: number; answer: string }>;
}
