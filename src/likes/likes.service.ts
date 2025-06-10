import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Like } from './entities/like.entity';
import { ContentType } from '../common/types/content.types';
import { ContentHelperService } from '../common/services/content-helper.service';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(Like)
    private likesRepository: Repository<Like>,
    private contentHelper: ContentHelperService,
  ) {}

  async createLike(userId: string, contentId: string, contentType: ContentType): Promise<Like> {
    const contentIds = this.contentHelper.getContentIds(contentId, contentType);
    const like = this.likesRepository.create({
      user_id: userId,
      ...contentIds,
      content_type: contentType,
    });

    return this.likesRepository.save(like);
  }

  async removeLike(userId: string, contentId: string, contentType: ContentType): Promise<void> {
    const query = this.contentHelper.getContentQuery(userId, contentId, contentType);
    const result = await this.likesRepository.delete(query);

    if (result.affected === 0) {
      throw new NotFoundException('Like not found');
    }
  }

  async toggleLike(userId: string, contentId: string, contentType: ContentType): Promise<{ liked: boolean }> {
    const query = this.contentHelper.getContentQuery(userId, contentId, contentType);
    const existingLike = await this.likesRepository.findOne({ where: query });

    if (existingLike) {
      await this.removeLike(userId, contentId, contentType);
      return { liked: false };
    } else {
      await this.createLike(userId, contentId, contentType);
      return { liked: true };
    }
  }

  async getLikesCount(contentId: string, contentType: ContentType): Promise<number> {
    const contentIds = this.contentHelper.getContentIds(contentId, contentType);
    return this.likesRepository.count({ where: contentIds });
  }

  async hasLiked(userId: string, contentId: string, contentType: ContentType): Promise<boolean> {
    const query = this.contentHelper.getContentQuery(userId, contentId, contentType);
    const like = await this.likesRepository.findOne({ where: query });
    return !!like;
  }
} 