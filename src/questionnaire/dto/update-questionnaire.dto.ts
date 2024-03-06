import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateQuestionnaireDto } from './create-questionnaire.dto';

export class UpdateQuestionnaireDto extends PartialType(
  CreateQuestionnaireDto,
) {
  @ApiProperty()
  id: number;

  @ApiProperty()
  indexId: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  isPublished: number;

  @ApiProperty()
  isDeleted: number;

  @ApiProperty()
  create_time: string;
}
