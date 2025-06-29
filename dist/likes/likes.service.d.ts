import { Repository } from 'typeorm';
import { Like } from './entities/like.entity';
import { ContentType } from '../common/types/content.types';
import { ContentHelperService } from '../common/services/content-helper.service';
export declare class LikesService {
    private likesRepository;
    private contentHelper;
    constructor(likesRepository: Repository<Like>, contentHelper: ContentHelperService);
    createLike(userId: string, contentId: string, contentType: ContentType): Promise<Like>;
    removeLike(userId: string, contentId: string, contentType: ContentType): Promise<void>;
    toggleLike(userId: string, contentId: string, contentType: ContentType): Promise<{
        liked: boolean;
    }>;
    getLikesCount(contentId: string, contentType: ContentType): Promise<number>;
    hasLiked(userId: string, contentId: string, contentType: ContentType): Promise<boolean>;
}
