export type ContentType = 'Room' | 'Media';

export interface ContentIds {
  room_id: string | null;
  media_id: string | null;
}

export interface ContentQuery {
  user_id: string;
  room_id: string | null;
  media_id: string | null;
} 