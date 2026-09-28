import { Controller, Get } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { EmailService } from './email.service';
import { testJobs } from 'test-data/test-jobs';

@Controller('jobs')
export class JobsController {
  // This just means that this controller depends on this service
  // Dependency injecting is essentially, a class declares what it needs, and the framework supplies it
  constructor(
    private readonly jobsService: JobsService,
    private readonly emailService: EmailService,
  ) {}

  @Get()
  async getJobs() {
    try {
      const jobs = await this.jobsService.getJobs();
      await this.emailService.sendEmail(jobs);
      return jobs;
    } catch (error) {
      // To-do: Handle error closer to documentation
      await this.emailService.sendErrorEmail(error);
      throw error;
    }
  }

  @Get('/test')
  async getTestJobs() {
    try {
      return testJobs;
    } catch (error) {
      // To-do: Handle error closer to documentation
      await this.emailService.sendErrorEmail(error);
      throw error;
    }
  }
}
