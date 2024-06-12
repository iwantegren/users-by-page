import { ReadUserDto } from './read-user.dto';

export class ReadPageDto {
  page: number;
  total_pages: number;
  total_users: number;
  count: number;
  links: { next_url: string; prev_url: string };
  users: ReadUserDto[];
}
