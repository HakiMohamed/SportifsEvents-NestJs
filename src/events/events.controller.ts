// src/events/events.controller.ts
import { 
    Controller, 
    Post, 
    Get, 
    Put, 
    Delete, 
    Body, 
    Param, 
    Request, 
    UseGuards, 
    Res 
  } from '@nestjs/common';
  import { EventsService } from './events.service';
  import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
  import { CreateEventDto, AddParticipantDto } from './dto/event.dto';

  @Controller('events')
  @UseGuards(JwtAuthGuard)
  export class EventsController {
    constructor(private readonly eventsService: EventsService) {}

    @Post('/create')
    async createEvent(@Body() eventData: CreateEventDto, @Request() req) {
      console.log('EventsController.createEvent', eventData, req.user.sub);
      return this.eventsService.createEvent(eventData, req.user.sub);
    }

    @Get()
    async getAllEvents(@Request() req) {
      console.log('EventsController.getAllEvents', req.user.sub);
      return this.eventsService.findAllEvents(req.user.sub);
    }

    @Get(':id')
    async getEvent(@Param('id') eventId: string, @Request() req) {
      console.log('EventsController.getEvent', eventId, req.user.sub);
      return this.eventsService.findEventById(eventId, req.user.sub);
    }

    @Put(':id')
    async updateEvent(
      @Param('id') eventId: string, 
      @Body() eventData: CreateEventDto, 
      @Request() req
    ) {
      console.log('EventsController.updateEvent', eventId, eventData, req.user.sub);
      return this.eventsService.updateEvent(eventId, eventData, req.user.sub);
    }

    @Delete(':id')
    async deleteEvent(@Param('id') eventId: string, @Request() req) {
      console.log('EventsController.deleteEvent', eventId, req.user.sub);
      return this.eventsService.deleteEvent(eventId, req.user.sub);
    }

    @Post(':id/participants')
    async addParticipant(
      @Param('id') eventId: string, 
      @Body() participantData: AddParticipantDto,
      @Request() req
    ) {
      console.log('EventsController.addParticipant', eventId, req.user.sub, participantData);
      return this.eventsService.addParticipant(eventId, req.user.sub, participantData);
    }

    @Delete(':id/participants/:email')
    async removeParticipant(
      @Param('id') eventId: string, 
      @Param('email') participantEmail: string,
      @Request() req
    ) {
      console.log('EventsController.removeParticipant', eventId, req.user.sub, participantEmail);
      return this.eventsService.removeParticipant(eventId, req.user.sub, participantEmail);
    }

    @Get(':id/participants/report')  
    async downloadParticipantReport(  
      @Param('id') eventId: string,   
      @Res() res,  
      @Request() req  
    ) {  
      console.log('EventsController.downloadParticipantReport', eventId, req.user.sub);  
      const report = await this.eventsService.generateParticipantReport(eventId, req.user.sub);  
      
      res.header('Content-Type', 'application/pdf');  
      res.header('Content-Disposition', `attachment; filename=participants_${eventId}.pdf`);  
      res.send(report);  
    }
  }
