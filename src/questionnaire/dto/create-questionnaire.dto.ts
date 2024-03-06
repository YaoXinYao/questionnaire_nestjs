import { ApiProperty } from '@nestjs/swagger';
export class CreateQuestionnaireDto {
  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  isPublished: number;

  @ApiProperty()
  isDeleted: number;

  @ApiProperty()
  creatorId: number;
}
