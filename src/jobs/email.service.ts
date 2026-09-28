import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import { Job } from './jobs.service';
import { createEmailTemplate } from './email-template';

@Injectable()
export class EmailService {
  private readonly resendClient: Resend;
  constructor(private readonly configService: ConfigService) {
    this.resendClient = new Resend(
      this.configService.get<string>('RESEND_API_KEY'),
    );
  }

  async sendEmail(jobs: Job[]) {
    const html = createEmailTemplate(jobs);

    await this.resendClient.emails.send({
      from: 'onboarding@resend.dev',
      to: 'tobiaswnorton@gmail.com',
      subject: 'Your Daily Job Drop',
      html,
    });
  }

  // To-do: Handle error closer to documentation
  async sendErrorEmail(error: Error) {
    const message = error
      ? error.message
      : 'Unknown error; check your code or subscriptions!';

    await this.resendClient.emails.send({
      from: 'onboarding@resend.dev',
      to: 'tobiaswnorton@gmail.com',
      subject: `Your Daily Job Drop Plopped...`,
      html: `<p>Sorry, dude, something broke.</p><p>${message}</p>`,
    });
  }
}
