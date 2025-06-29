import { Repository } from 'typeorm';
import { Favorite } from './entities/favorite.entity';
import { ContentType } from '../common/types/content.types';
import { ContentHelperService } from '../common/services/content-helper.service';
export declare class FavoritesService {
    private favoritesRepository;
    private contentHelper;
    constructor(favoritesRepository: Repository<Favorite>, contentHelper: ContentHelperService);
    createFavorite(userId: string, contentId: string, contentType: ContentType): Promise<Favorite>;
    removeFavorite(userId: string, contentId: string, contentType: ContentType): Promise<void>;
    toggleFavorite(userId: string, contentId: string, contentType: ContentType): Promise<{
        favorited: boolean;
    }>;
    getUserFavorites(userId: string): Promise<Favorite[]>;
    getFavoritesCount(contentId: string, contentType: ContentType): Promise<number>;
    hasFavorited(userId: string, contentId: string, contentType: ContentType): Promise<boolean>;
}
