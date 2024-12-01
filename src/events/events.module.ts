// src\events\events.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { Event, EventSchema } from './events.model';
import { AuthModule } from '../auth/auth.module';
import { JwtService } from '@nestjs/jwt';
<<<<<<< HEAD
=======

>>>>>>> 7e5083d8198afbdca809d829b83ebc07c1d1917b
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }]),
    AuthModule
  ],
  controllers: [EventsController],
  providers: [EventsService, JwtService],
  exports: [EventsService]
})
export class EventsModule {}