import { Job } from './jobs.service';

export const createEmailTemplate = (jobs: Job[]) => {
  return `
  <h1>Your Daily Job Drop!</h1>

  ${jobs
    .map((job) => {
      return `
      <h3>${job.title}</h3>
      <div>Company: ${job.companyName}</div>
      <div>Location: ${job.location}</div>
      <div>Posted: ${job.postedTime}</div>
      <div>Apply: <a href=${job.applyUrl} target="_blank">${job.applyUrl}</a></div>
      <div>LinkedIn Post: ${job.jobUrl}</div>
      `;
    })
    .join('')}
  
  `;
};
