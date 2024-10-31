import { Injectable } from '@nestjs/common';
import { BibleRepository } from '../repositories/bible.repository';

@Injectable()
export class BibleService {
  constructor(private readonly bibleRepository: BibleRepository) {}

  async getVerseOfTheDay(): Promise<any> {
    return this.bibleRepository.getVerseOfTheDay();
  }

  async getBooksByVersion(version: string): Promise<any[]> {
    console.log('services getBooksByVersion');
    return this.bibleRepository.getBooksByVersion(version);
  }

  async getChaptersByBook(version: string, book: string): Promise<any[]> {
    return this.bibleRepository.getChaptersByBook(version, book);
  }

  async listBookDetails(abrev?: string): Promise<any> {
    return this.bibleRepository.listBookDetails(abrev);
  }

  async listVersions(): Promise<string[]> {
    return this.bibleRepository.listVersions();
  }

  async getVersesByChapter(
    version: string,
    book: string,
    chapter: number,
  ): Promise<any[]> {
    return this.bibleRepository.getVersesByChapter(version, book, chapter);
  }
}
