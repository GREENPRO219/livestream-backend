import { Injectable } from '@nestjs/common';
import { ContentType, ContentIds, ContentQuery } from '../types/content.types';

@Injectable()
export class ContentHelperService {
  getContentIds(contentId: string, contentType: ContentType): ContentIds {
    return {
      room_id: contentType === 'Room' ? contentId : null,
      media_id: contentType === 'Media' ? contentId : null,
    };
  }

  getContentQuery(userId: string, contentId: string, contentType: ContentType): ContentQuery {
    return {
      user_id: userId,
      ...this.getContentIds(contentId, contentType),
    };
  }
} 