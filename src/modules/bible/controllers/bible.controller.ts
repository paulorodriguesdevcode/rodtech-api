import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { BibleService } from '../services/bible.service';

@Controller('biblia')
export class BibleController {
  constructor(private readonly bibleService: BibleService) {}

  @Get('/versions')
  async listVersions(): Promise<string[]> {
    return await this.bibleService.listVersions();
  }

  @Get('/books/details')
  async listBookDetails(): Promise<any> {
    return await this.bibleService.listBookDetails();
  }

  @Get('/books/details/:abrev')
  async listOneBookDetails(@Param('abrev') abrev: string): Promise<any> {
    return await this.bibleService.listBookDetails(abrev);
  }

  @Get()
  async getVerseOfTheDay(): Promise<any> {
    const verse = await this.bibleService.getVerseOfTheDay();
    if (!verse) {
      throw new NotFoundException('No verse found for today');
    }
    return verse;
  }

  @Get(':version')
  async listBooks(@Param('version') version: string): Promise<any> {
    const books = await this.bibleService.getBooksByVersion(version);
    if (!books || books.length === 0) {
      throw new NotFoundException(`Version ${version} not found`);
    }
    return books;
  }

  @Get(':version/:book')
  async listChapters(
    @Param('version') version: string,
    @Param('book') book: string,
  ): Promise<any> {
    const chapters = await this.bibleService.getChaptersByBook(version, book);
    if (!chapters || chapters.length === 0) {
      throw new NotFoundException(
        `Book ${book} not found in version ${version}`,
      );
    }
    return chapters;
  }

  @Get(':version/:book/:chapter')
  async listVerses(
    @Param('version') version: string,
    @Param('book') book: string,
    @Param('chapter') chapter: string,
  ): Promise<any> {
    const verses = await this.bibleService.getVersesByChapter(
      version,
      book,
      parseInt(chapter, 10),
    );
    if (!verses || verses.length === 0) {
      throw new NotFoundException(
        `Chapter ${chapter} not found in book ${book} for version ${version}`,
      );
    }
    return verses;
  }
}
