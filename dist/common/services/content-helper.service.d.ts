import { ContentType, ContentIds, ContentQuery } from '../types/content.types';
export declare class ContentHelperService {
    getContentIds(contentId: string, contentType: ContentType): ContentIds;
    getContentQuery(userId: string, contentId: string, contentType: ContentType): ContentQuery;
}
