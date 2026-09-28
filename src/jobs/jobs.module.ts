import { Module } from '@nestjs/common';
import { JobsController } from './jobs.controller';
import { JobsService } from './jobs.service';
import { ApifyModule } from 'src/apify/apify.module';
import { EmailService } from './email.service';

@Module({
  imports: [ApifyModule],
  controllers: [JobsController],
  providers: [JobsService, EmailService],
})
export class JobsModule {}
