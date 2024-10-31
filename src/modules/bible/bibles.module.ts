import { Module } from '@nestjs/common';
import { BibleService } from './services/bible.service';
import { BibleController } from './controllers/bible.controller';
import { BibleRepository } from './repositories/bible.repository';

@Module({
  imports: [],
  controllers: [BibleController],
  providers: [BibleService, BibleRepository],
})
export class BiblesModule {}
