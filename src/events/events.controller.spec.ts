import { Test, TestingModule } from '@nestjs/testing';
import { EventsService } from './events.service';
import { getModelToken } from '@nestjs/mongoose';
import { Event } from './events.model';
import { Model } from 'mongoose';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('EventsService', () => {
  let service: EventsService;
  let model: Model<Event>;

  const mockEventModel = {
    find: jest.fn(),
    findOne: jest.fn(),
    deleteOne: jest.fn(),
    save: jest.fn(),
    new: jest.fn(),
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
    model = module.get<Model<Event>>(getModelToken(Event.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAllEvents', () => {
    it('should return all events for organizer', async () => {
      const organizerId = 'organizerId';
      const mockEvents = [
        { name: 'Event 1', organizer: organizerId },
        { name: 'Event 2', organizer: organizerId },
      ];

      mockEventModel.find.mockResolvedValue(mockEvents);

      const result = await service.findAllEvents(organizerId);

      expect(model.find).toHaveBeenCalledWith({ organizer: organizerId });
      expect(result).toEqual(mockEvents);
    });

    it('should throw NotFoundException when no events found', async () => {
      mockEventModel.find.mockResolvedValue([]);

      await expect(service.findAllEvents('organizerId'))
        .rejects
        .toThrow(NotFoundException);
    });
  });

  describe('addParticipant', () => {
    
    it('should throw BadRequestException when event is full', async () => {
      const mockEvent = {
        maxParticipants: 1,
        participants: [{ email: 'existing@example.com' }],
      };
  
      mockEventModel.findOne.mockResolvedValue(mockEvent);
  
      await expect(
        service.addParticipant('eventId', 'organizerId', {
          email: 'new@example.com',
          fullName: 'John Doe',
          phone: '1234567890'
        })
      ).rejects.toThrow(BadRequestException);
    });
  });
});

    