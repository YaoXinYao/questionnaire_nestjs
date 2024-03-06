import { ApiProperty } from '@nestjs/swagger';
export class UpdateQuestionDto {
  @ApiProperty()
  id: number;

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

  @ApiProperty()
  create_time: string;
}
