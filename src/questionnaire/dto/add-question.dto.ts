import { ApiProperty } from '@nestjs/swagger';
export class AddQuestionDto {
  @ApiProperty()
  indexId: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  type: string;

  @ApiProperty()
  isHidden: number;

  @ApiProperty()
  isLocked: number;

  @ApiProperty()
  props: any;

  @ApiProperty()
  qId: number;
}
