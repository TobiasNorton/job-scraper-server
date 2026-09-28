import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JobsModule } from './jobs/jobs.module';
// import { ApifyService } from './apify/apify.service';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
import { ApifyModule } from './apify/apify.module';

// A module is basically a container that tells Nest: "These are the pieces that belong to this part of the application." Seems just like
// a way to organize code.
// The AppModule is currently the root module, essentially the top-level container for the app
// imports: [JobsModule], // other modules this module depends on
// controllers: [AppController], // things that receive HTTP requests, where we point the endpoints
// providers: [AppService], // services/classes that contain application logic

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JobsModule,
    ApifyModule,
  ],
})
export class AppModule {}
