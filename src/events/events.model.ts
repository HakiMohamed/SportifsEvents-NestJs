// src/events/events.model.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class Event extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  location: string;

  @Prop({ type: [{ 
    type: {
      fullName: String,
      email: String,
      phone: String,
      registrationDate: { type: Date, default: Date.now }
    }
  }] })
  participants: Array<{
    fullName: string;
    email: string;
    phone?: string;
    registrationDate: Date;
  }>;

  @Prop({ default: 50 })
  maxParticipants: number;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  organizer: MongooseSchema.Types.ObjectId;
}

export const EventSchema = SchemaFactory.createForClass(Event);