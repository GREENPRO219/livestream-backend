import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favorite } from './entities/favorite.entity';
import { ContentType } from '../common/types/content.types';
import { ContentHelperService } from '../common/services/content-helper.service';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Favorite)
    private favoritesRepository: Repository<Favorite>,
    private contentHelper: ContentHelperService,
  ) {}

  async createFavorite(userId: string, contentId: string, contentType: ContentType): Promise<Favorite> {
    const contentIds = this.contentHelper.getContentIds(contentId, contentType);
    const favorite = this.favoritesRepository.create({
      user_id: userId,
      ...contentIds,
      content_type: contentType,
    });

    return this.favoritesRepository.save(favorite);
  }

  async removeFavorite(userId: string, contentId: string, contentType: ContentType): Promise<void> {
    const query = this.contentHelper.getContentQuery(userId, contentId, contentType);
    const result = await this.favoritesRepository.delete(query);

    if (result.affected === 0) {
      throw new NotFoundException('Favorite not found');
    }
  }

  async toggleFavorite(userId: string, contentId: string, contentType: ContentType): Promise<{ favorited: boolean }> {
    const query = this.contentHelper.getContentQuery(userId, contentId, contentType);
    const existingFavorite = await this.favoritesRepository.findOne({ where: query });

    if (existingFavorite) {
      await this.removeFavorite(userId, contentId, contentType);
      return { favorited: false };
    } else {
      await this.createFavorite(userId, contentId, contentType);
      return { favorited: true };
    }
  }

  async getUserFavorites(userId: string): Promise<Favorite[]> {
    return this.favoritesRepository.find({
      where: { user_id: userId },
      relations: ['room', 'media'],
      order: { created_at: 'DESC' },
    });
  }

  async getFavoritesCount(contentId: string, contentType: ContentType): Promise<number> {
    const contentIds = this.contentHelper.getContentIds(contentId, contentType);
    return this.favoritesRepository.count({ where: contentIds });
  }

  async hasFavorited(userId: string, contentId: string, contentType: ContentType): Promise<boolean> {
    const query = this.contentHelper.getContentQuery(userId, contentId, contentType);
    const favorite = await this.favoritesRepository.findOne({ where: query });
    return !!favorite;
  }
} 