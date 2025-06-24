import { LikesService } from '../likes/likes.service';
export declare class LikesController {
    private readonly likesService;
    constructor(likesService: LikesService);
    likeMedia(req: any, mediaId: string): Promise<import("./entities/like.entity").Like>;
    unlikeMedia(req: any, mediaId: string): Promise<void>;
    likeRoom(req: any, roomId: string): Promise<import("./entities/like.entity").Like>;
    unlikeRoom(req: any, roomId: string): Promise<void>;
    toggleMediaLike(req: any, mediaId: string): Promise<{
        liked: boolean;
    }>;
    toggleRoomLike(req: any, roomId: string): Promise<{
        liked: boolean;
    }>;
    getMediaLikesCount(mediaId: string): Promise<{
        count: number;
    }>;
    getRoomLikesCount(roomId: string): Promise<{
        count: number;
    }>;
    getMediaLikeStatus(req: any, mediaId: string): Promise<{
        liked: boolean;
    }>;
    getRoomLikeStatus(req: any, roomId: string): Promise<{
        liked: boolean;
    }>;
}
