// \src\events\events.service.ts
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event } from './events.model';
import { CreateEventDto, AddParticipantDto, UpdateEventDto } from './dto/event.dto';
import { PassThrough } from 'stream';
import * as PDFKit from 'pdfkit';
@Injectable()
export class EventsService {
  constructor(
    @InjectModel(Event.name) private eventModel: Model<Event>
  ) {}

  async createEvent(eventData: CreateEventDto, organizerId: string) {
    console.log('EventsService.createEvent', 'eventdata:',eventData, 'organizerId:', organizerId);
    const event = new this.eventModel({
      ...eventData,
      organizer: organizerId,
      participants: []
    });
    return event.save();
  }   
  

  async findAllEvents(organizerId: string) {
    console.log('EventsService.findAllEvents', organizerId);
    const events = await this.eventModel.find({ organizer: organizerId });
    
    if (!events || events.length === 0) {
      throw new NotFoundException('You have no events at the moment');
    }

    return events;
  }

  async findEventById(eventId: string, organizerId: string) {
    console.log('EventsService.findEventById', eventId, organizerId);
    const event = await this.eventModel.findOne({ 
      _id: eventId, 
      organizer: organizerId 
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    return event;
  }

  async updateEvent(eventId: string, eventData: Partial<UpdateEventDto>, organizerId: string) {
    console.log('EventsService.updateEvent', eventId, eventData, organizerId);
    const event = await this.findEventById(eventId, organizerId);
    
    Object.assign(event, eventData);
    return event.save();
  }

  async deleteEvent(eventId: string, organizerId: string) {
    console.log('EventsService.deleteEvent', eventId, organizerId);
    const result = await this.eventModel.deleteOne({ 
      _id: eventId, 
      organizer: organizerId 
    });

    if (result.deletedCount === 0) {
      throw new NotFoundException('Event not found');
    } 

    return { message: 'Event successfully deleted' };
  }

  async addParticipant(eventId: string, organizerId: string, participantData: AddParticipantDto) {
    console.log('EventsService.addParticipant', eventId, organizerId, participantData);
    const event = await this.findEventById(eventId, organizerId);

    if (event.maxParticipants > 0 && 
        event.participants.length >= event.maxParticipants) {
      throw new BadRequestException('Event is full');
    }

    const existingParticipant = event.participants.find(
      p => p.email === participantData.email
    );

    if (existingParticipant) {
      throw new BadRequestException('Participant already registered');
    }

    event.participants.push({
      fullName: participantData.fullName,
      email: participantData.email,
      phone: participantData.phone,
      registrationDate: new Date()
    });

    return event.save();
  }

  async removeParticipant(eventId: string, organizerId: string, participantEmail: string) {
    console.log('EventsService.removeParticipant', eventId, organizerId, participantEmail);
    const event = await this.findEventById(eventId, organizerId);

    event.participants = event.participants.filter(
      p => p.email !== participantEmail
    );

    return event.save();
  }

  async generateParticipantReport(eventId: string, organizerId: string) {
    console.log('EventsService.generateParticipantReport', eventId, organizerId);
    const event = await this.findEventById(eventId, organizerId);
    
    const doc = new PDFKit({
      margin: 50,
      size: 'A4',
      bufferPages: true
    });
    const buffers = [];
    
    doc.pipe(new PassThrough().on('data', chunk => buffers.push(chunk)));

    // Modern header style
    doc.rect(0, 0, doc.page.width, 150)
       .fill('#2196F3');

    doc.font('Helvetica-Bold')
       .fillColor('#FFFFFF')
       .fontSize(32)
       .text('Participant List', 50, 50, {align: 'center'})
       .fontSize(24)
       .text(event.name, 50, 95, {align: 'center'})
       .moveDown(2);

    // Modern table header
    const tableTop = 180;
    const colWidth = (doc.page.width - 100) / 4;
    
    // Table header background
    doc.rect(50, tableTop - 5, doc.page.width - 100, 40)
       .fill('#F5F5F5');

    // Header text
    doc.font('Helvetica-Bold')
       .fontSize(14)
       .fillColor('#212121');

    const headers = ['Name', 'Email', 'Phone', 'Registration Date'];
    headers.forEach((header, i) => {
      doc.text(header, 50 + (i * colWidth), tableTop + 10, {
        width: colWidth,
        align: 'center'
      });
    });

    let rowTop = tableTop + 50;

    // Participant rows with modern design
    doc.font('Helvetica')
       .fontSize(12);

    event.participants.forEach((p, i) => {
      // Alternating background for better readability
      if (i % 2 === 0) {
        doc.rect(50, rowTop - 5, doc.page.width - 100, 35)
           .fill('#FAFAFA');
      }

      const rowData = [
        p.fullName,
        p.email,
        p.phone || '-',
        new Date(p.registrationDate).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      ];

      rowData.forEach((text, j) => {
        doc.fillColor('#424242')
           .text(text, 50 + (j * colWidth), rowTop, {
             width: colWidth,
             align: 'center'
           });
      });

      rowTop += 35;

      // New page if needed
      if (rowTop > doc.page.height - 100) {
        doc.addPage();
        // Repeat header on new page
        doc.rect(0, 0, doc.page.width, 50)
           .fill('#2196F3');
        rowTop = 70;
      }
    });

    // Modern footer
    const bottomY = doc.page.height - 70;
    doc.rect(0, bottomY, doc.page.width, 70)
       .fill('#F5F5F5');
       
    doc.fontSize(12)
       .fillColor('#616161')
       .text(
         `Generated on ${new Date().toLocaleDateString('en-US', {
           year: 'numeric',
           month: 'long',
           day: 'numeric',
           hour: '2-digit',
           minute: '2-digit'
         })}`,
         50,
         bottomY + 25,
         {
           align: 'center',
           width: doc.page.width - 100
         }
       );
    
    doc.end();
    return new Promise((resolve) => {
      doc.on('end', () => {
        resolve(Buffer.concat(buffers));
      });
    });
  }
}
