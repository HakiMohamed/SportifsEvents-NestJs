// src\events\events.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { Event, EventSchema } from './events.model';
import { AuthModule } from '../auth/auth.module';
import { JwtService } from '@nestjs/jwt';
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