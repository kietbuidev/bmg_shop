import {IsNotEmpty, IsNumber, IsOptional, IsString} from 'class-validator';

export class SearchPostRequest {
  @IsNumber()
  category_id?: number;

  @IsString()
  keyword?: string;

  @IsString()
  status?: string;
}

export class LatestPostDto {
  category: string;

  sort: string;
}

export class generateLinkRequest {
  @IsString()
  @IsNotEmpty()
  post_slug: string;
}
