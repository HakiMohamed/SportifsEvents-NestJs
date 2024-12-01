import { Test, TestingModule } from '@nestjs/testing';
import { EventsService } from './events.service';
import { getModelToken } from '@nestjs/mongoose';
import { Event } from './events.model';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Types, Schema as MongooseSchema } from 'mongoose';

describe('EventsService', () => {
  let service: EventsService;
<<<<<<< HEAD

=======
>>>>>>> 7e5083d8198afbdca809d829b83ebc07c1d1917b
  const mockEvent = {
    _id: 'eventId',
    name: 'Test Event', 
    description: 'Test Description',
    date: new Date(),
    location: 'Test Location',
    maxParticipants: 100,
    organizer: new MongooseSchema.Types.ObjectId('organizerId'),
    participants: [],
    save: jest.fn().mockResolvedValue(this),
    $assertPopulated: jest.fn(),
    $clearModifiedPaths: jest.fn(),
    $clone: jest.fn(),
    $createModifiedPathsSnapshot: jest.fn(),
    __v: 0,
  };

  // Updated mock model as a constructor function
  const mockEventModel = function() {
    return {
      ...mockEvent,
      save: jest.fn().mockResolvedValue(mockEvent)
    };
  } as any;
  mockEventModel.find = jest.fn();
  mockEventModel.findOne = jest.fn();
  mockEventModel.deleteOne = jest.fn();

  // Helper function to create mock Mongoose documents
  const createMockEvent = (eventData: Partial<Event>) => {
    return {
      _id: 'eventId',
      ...eventData,
      $assertPopulated: jest.fn(),
      $clearModifiedPaths: jest.fn(),
      $clone: jest.fn(),
      $createModifiedPathsSnapshot: jest.fn(),
      __v: 0,
      toObject: jest.fn().mockReturnValue(eventData),
      save: jest.fn().mockResolvedValue(eventData),
    } as any;
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsService,
        {
          provide: getModelToken(Event.name),
          useValue: mockEventModel,
        },
      ],
    }).compile();

    service = module.get<EventsService>(EventsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAllEvents', () => {
    it('should return all events for an organizer', async () => {
      const events = [mockEvent];
      mockEventModel.find.mockResolvedValue(events);

      const result = await service.findAllEvents('organizerId');
      expect(result).toEqual(events);
    });

    it('should throw NotFoundException if no events found', async () => {
      mockEventModel.find.mockResolvedValue([]);

      await expect(service.findAllEvents('organizerId')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findEventById', () => {
    it('should return an event if found', async () => {
      mockEventModel.findOne.mockResolvedValue(mockEvent);

      const result = await service.findEventById('eventId', 'organizerId');
      expect(result).toEqual(mockEvent);
    });

    it('should throw NotFoundException if event not found', async () => {
      mockEventModel.findOne.mockResolvedValue(null);

      await expect(
        service.findEventById('eventId', 'organizerId'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('addParticipant', () => {
    it('should add participant when space available', async () => {
      const eventWithSpace = createMockEvent({
        participants: [],
        name: 'Test Event',
        description: 'Test Description',
        date: new Date(),
        location: 'Test Location',
        maxParticipants: 10,
        organizer: new MongooseSchema.Types.ObjectId('organizerId'),
      });

      jest.spyOn(service, 'findEventById').mockResolvedValue(eventWithSpace);

      const participantData = {
        email: 'new@example.com',
        fullName: 'John Doe',
        phone: '1234567890',
      };

      await service.addParticipant('eventId', 'organizerId', participantData);
      expect(eventWithSpace.save).toHaveBeenCalled();
    });

    it('should throw BadRequestException when event is full', async () => {
      const fullEvent = createMockEvent({
        maxParticipants: 1,
        participants: [{
          fullName: 'Test User',
          email: 'test@example.com',
          phone: '1234567890',
          registrationDate: new Date()
        }],
        name: 'Test Event',
        description: 'Test Description',
        date: new Date(),
        location: 'Test Location',
        organizer: new MongooseSchema.Types.ObjectId('organizerId'),
      });

      jest.spyOn(service, 'findEventById').mockResolvedValue(fullEvent);

      const participantData = {
        email: 'new@example.com',
        fullName: 'John Doe',
        phone: '1234567890',
      };

      await expect(
        service.addParticipant('eventId', 'organizerId', participantData),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when participant already registered', async () => {
      const eventWithParticipant = createMockEvent({
        participants: [{
          fullName: 'Test User',
          email: 'test@example.com',
          phone: '1234567890',
          registrationDate: new Date()
        }],
        name: 'Test Event',
        description: 'Test Description',
        date: new Date(),
        location: 'Test Location',
        maxParticipants: 10,
        organizer: new MongooseSchema.Types.ObjectId('organizerId'),
      });

      jest.spyOn(service, 'findEventById').mockResolvedValue(eventWithParticipant);

      const participantData = {
        email: 'test@example.com',
        fullName: 'Test User',
        phone: '1234567890',
      };

      await expect(
        service.addParticipant('eventId', 'organizerId', participantData),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('removeParticipant', () => {
    it('should remove participant from event', async () => {
      const eventWithParticipants = createMockEvent({
        participants: [{
          fullName: 'Test User',
          email: 'test@example.com',
          phone: '1234567890',
          registrationDate: new Date()
        }],
        name: 'Test Event',
        description: 'Test Description',
        date: new Date(),
        location: 'Test Location',
        maxParticipants: 10,
        organizer: new MongooseSchema.Types.ObjectId('organizerId'),
      });

      jest.spyOn(service, 'findEventById').mockResolvedValue(eventWithParticipants);

      await service.removeParticipant('eventId', 'organizerId', 'test@example.com');
      expect(eventWithParticipants.save).toHaveBeenCalled();
    });
  });

  describe('deleteEvent', () => {
    it('should delete event successfully', async () => {
      mockEventModel.deleteOne.mockResolvedValue({ deletedCount: 1 });

      const result = await service.deleteEvent('eventId', 'organizerId');
      expect(result.message).toBe('Event successfully deleted');
    });

    it('should throw NotFoundException if event not found for deletion', async () => {
      mockEventModel.deleteOne.mockResolvedValue({ deletedCount: 0 });

      await expect(
        service.deleteEvent('eventId', 'organizerId'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateEvent', () => {
    it('should update event successfully', async () => {
      const updatedEvent = createMockEvent({
        name: 'Updated Event',
        description: 'Test Description',
        date: new Date(),
        location: 'Test Location',
        maxParticipants: 100,
        organizer: new MongooseSchema.Types.ObjectId('organizerId'),
        participants: [],
      });

      jest.spyOn(service, 'findEventById').mockResolvedValue(updatedEvent);
  
      const result = await service.updateEvent('eventId', { name: 'Updated Event' }, 'organizerId');
      expect(result.name).toBe('Updated Event');
    });
  });

  describe('createEvent', () => {
    it('should create event successfully', async () => {
      const eventData = {
        name: 'Test Event',
        description: 'New Description',
        date: new Date(),
        location: 'New Location',
        maxParticipants: 100,
      };

      const result = await service.createEvent(eventData, 'organizerId');
      expect(result).toHaveProperty('name', eventData.name);
    });
  });
});