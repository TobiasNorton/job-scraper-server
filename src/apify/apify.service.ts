import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApifyClient } from 'apify-client';
import { Job } from 'src/jobs/jobs.service';

@Injectable()
export class ApifyService {
  private readonly apifyClient: ApifyClient;
  constructor(private readonly configService: ConfigService) {
    this.apifyClient = new ApifyClient({
      token: this.configService.get<string>('APIFY_API_TOKEN'),
    });
  }

  async getJobs(): Promise<Job[]> {
    // This is the actor that does the scraping for us
    const bebityActorId = this.configService.get<string>(
      'APIFY_BEBITY_ACTOR_ID',
    );

    if (!bebityActorId) {
      throw new Error('APIFY_BEBITY_ACTOR_ID is not configured');
    }
    //id: 'wY0BUAgvNDzvLdv8I',
    const usJobsRun = await this.apifyClient.actor(bebityActorId).call({
      companyProfile: true,
      contractTypes: ['F'],
      easyApply: false,
      enrichCompany: false, // set to true if we want companyEmployeeCount and more
      // experienceLevels: ['4'],
      locations: ['United States'],
      publishedAt: 'r604800',
      rows: 25,
      titles: ['Software Engineer', 'Frontend Software Engineer'],
      under10Applicants: false,
    });

    const floridaJobsRun = await this.apifyClient.actor(bebityActorId).call({
      companyProfile: true,
      contractTypes: ['F'],
      easyApply: false,
      enrichCompany: false, // set to true if we want companyEmployeeCount and more
      // experienceLevels: ['4'],
      locations: ['Florida'],
      publishedAt: 'r604800',
      rows: 25,
      titles: ['Software Engineer', 'Frontend Software Engineer'],
      under10Applicants: false,
    });

    // Now we call listItems() with that dataset ID to get the actual jobs
    const { items: usJobs } = await this.apifyClient
      .dataset(usJobsRun.defaultDatasetId)
      .listItems();
    const { items: floridaJobs } = await this.apifyClient
      .dataset(floridaJobsRun.defaultDatasetId)
      .listItems();
    return [...usJobs, ...floridaJobs] as unknown as Job[];
  }
}
