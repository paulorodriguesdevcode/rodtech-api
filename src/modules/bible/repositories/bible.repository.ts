import { Injectable } from '@nestjs/common';
import * as aa from '../versions/aa.json';
import * as acf from '../versions/acf.json';
import * as nvi from '../versions/nvi.json';
import * as booksDetails from '../versions/books-details.json';

type BibleVersion = 'AA' | 'ACF' | 'NVI';

interface BibleData {
  [key: string]: any;
}

export interface BooksDetails {
  name: string;
  abrev: string;
  totalChapters: number;
}

@Injectable()
export class BibleRepository {
  private readonly bibleData: BibleData = {
    AA: aa,
    ACF: acf,
    NVI: nvi,
  };

  async getVerseOfTheDay(): Promise<any> {
    const versionKeys = Object.keys(this.bibleData) as BibleVersion[];
    const randomVersion =
      versionKeys[Math.floor(Math.random() * versionKeys.length)];
    const books = this.bibleData[randomVersion];
    const randomBook = books[Math.floor(Math.random() * books.length)];
    const randomChapter =
      randomBook.chapters[
        Math.floor(Math.random() * randomBook.chapters.length)
      ];
    const randomVerse =
      randomChapter[Math.floor(Math.random() * randomChapter.length)];

    return {
      text: randomVerse,
      reference: `${randomBook.name} ${randomBook.chapters.indexOf(randomChapter) + 1}:${randomChapter.indexOf(randomVerse) + 1}`,
      version: randomVersion,
    };
  }

  async getBooksByVersion(version: string): Promise<any[]> {
    const books = this.bibleData[version.toUpperCase()];
    if (!books) {
      throw new Error(`Version ${version} not found`);
    }
    return books;
  }

  async getChaptersByBook(version: string, book: string): Promise<any[]> {
    const books = await this.getBooksByVersion(version);
    const bookData = books.find((b) => b.abbrev === book.toLowerCase());
    if (!bookData) {
      throw new Error(`Book ${book} not found in version ${version}`);
    }
    return bookData.chapters;
  }

  async listVersions(): Promise<string[]> {
    return ['aa', 'acf', 'nvi'];
  }

  async listBookDetails(abrev?: string) {
    if (abrev) {
      return booksDetails.find((book) => book.abrev == abrev);
    }
    return booksDetails;
  }

  async getVersesByChapter(
    version: string,
    book: string,
    chapter: number,
  ): Promise<any[]> {
    const chapters = await this.getChaptersByBook(version, book);
    const chapterData = chapters[chapter - 1];
    if (!chapterData) {
      throw new Error(
        `Chapter ${chapter} not found in book ${book} for version ${version}`,
      );
    }
    return chapterData;
  }
}
