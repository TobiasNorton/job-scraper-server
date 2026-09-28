import { Injectable } from '@nestjs/common';
import { ApifyService } from 'src/apify/apify.service';
// import { readFile } from 'fs/promises';
// import { join } from 'path';

export interface Job {
  title: string;
  companyName: string;
  location: string;
  jobFunction: string;
  contractType: string;
  companyEmployeeCount: number;
  experienceLevel: string;
  workType: string;
  salary: string;
  applyUrl: string;
  postedTime: string;
  publishedAt: string;
  applicationsCount: string;
  benefits: string;
  jobUrl: string;
  description: string;
}

@Injectable()
export class JobsService {
  constructor(private readonly apifyService: ApifyService) {}

  private filterJobs = (jobs: Job[]) => {
    const excludedTitleTerms = [
      'senior',
      'sr',
      'junior',
      'jr',
      'staff',
      'principle',
      'principal',
      'manager',
      'lead',
      'director',
      'associate',
      'backend',
      'back end',
      'devops',
    ];

    const tampaBayLocations = [
      'tampa',
      'st. petersburg',
      'st pete',
      'saint petersburg',
      'clearwater',
      'dunedin',
      'largo',
      'pinellas park',
      'palm harbor',
      'tarpon springs',
      'brandon',
      'riverview',
      'wesley chapel',
      'land o lakes',
      'new port richey',
      'safety harbor',
      'oldsmar',
    ];

    const relevantJobs = jobs.filter((job) => {
      const title: string =
        typeof job.title === 'string' ? job.title.toLowerCase() : '';
      const description: string =
        typeof job.description === 'string'
          ? job.description.toLowerCase()
          : '';
      const isReactPosition =
        title.includes('react') || description.includes('react');
      const location: string =
        typeof job.location === 'string' ? job.location.toLowerCase() : '';

      const isRemote =
        title.includes('remote') || description.includes('remote');
      const isInTampaBay = tampaBayLocations.some(
        (city) => location.includes(city) || description.includes(city),
      );

      const hasValidLocation = isInTampaBay || isRemote;
      // const hasMoreThan30Employees = Number(job.companyEmployeeCount) > 30; // change enrichCompany to true in the req obj for this. *Premium feature $
      const hasExcludedTitleTerms = excludedTitleTerms.some((term) =>
        new RegExp(`\\b${term}\\b`).test(title),
      );

      // if (hasExcludedTitleTerm || hasLessThan30Employees || !hasValidLocation) {
      //   return false;
      // }

      // return true;

      return isReactPosition && hasValidLocation && !hasExcludedTitleTerms;
    });

    return relevantJobs;
  };
  /**
   * This is a simple service hard-coded strictly for my current job search criteria. Ultimately I may add a frontend so that others may use it
   * and enter their own search parameters. I may also incorporate ai for more intelligent searches, i.e. filtering hard-requirements vs nice-to-haves
   */
  async getJobs() {
    const jobs: Job[] = await this.apifyService.getJobs();
    console.log('TOTAL JOBS FOUND: ', jobs.length);
    // const data = await readFile(
    //   join(process.cwd(), 'test-data', 'testJobs.json'),
    //   'utf-8',
    // );
    // const jobs = JSON.parse(data) as Job[]; // TODO: Implement Zod for actual JSON validation
    const relevantJobs = this.filterJobs(jobs);
    console.log('RELEVANT JOBS: ', relevantJobs.length);
    return relevantJobs;
  }
}
