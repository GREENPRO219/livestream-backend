import { FavoritesService } from '../favorites/favorites.service';
import { Favorite } from '../favorites/entities/favorite.entity';
export declare class FavoritesController {
    private readonly favoritesService;
    constructor(favoritesService: FavoritesService);
    favoriteMedia(req: any, mediaId: string): Promise<Favorite>;
    unfavoriteMedia(req: any, mediaId: string): Promise<void>;
    favoriteRoom(req: any, roomId: string): Promise<Favorite>;
    unfavoriteRoom(req: any, roomId: string): Promise<void>;
    toggleMediaFavorite(req: any, mediaId: string): Promise<{
        favorited: boolean;
    }>;
    toggleRoomFavorite(req: any, roomId: string): Promise<{
        favorited: boolean;
    }>;
    getUserFavorites(req: any): Promise<Favorite[]>;
    getMediaFavoritesCount(mediaId: string): Promise<{
        count: number;
    }>;
    getRoomFavoritesCount(roomId: string): Promise<{
        count: number;
    }>;
    getMediaFavoriteStatus(req: any, mediaId: string): Promise<{
        favorited: boolean;
    }>;
    getRoomFavoriteStatus(req: any, roomId: string): Promise<{
        favorited: boolean;
    }>;
}
