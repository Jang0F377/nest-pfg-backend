import {
  Inject,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { SeshDto } from './dto/sesh.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Sesh } from './model/sesh.model';
import { Model } from 'mongoose';
import { SeshRepository } from './repositories/sesh.repository';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SESH_EVENTS, SeshAcceptedEvent } from 'src/constants/events';

@Injectable()
export class SeshService {
  constructor(
    @InjectModel(Sesh.name) private seshModel: Model<Sesh>,
    @Inject(SeshRepository) private seshRepository: SeshRepository,
    private eventEmitter: EventEmitter2,
  ) {}

  async getSesh(id: string): Promise<SeshDto> {
    const sesh = await this.seshModel.findById(id);

    if (!sesh) {
      throw new NotFoundException('Sesh not found by Id');
    }

    return sesh;
  }

  async createNewSesh(token: string, sesh: SeshDto): Promise<SeshDto> {
    try {
      const finalizedSesh = await this.seshRepository.finalizeSeshDetails(
        token,
        sesh,
      );

      return finalizedSesh;
    } catch {
      throw new UnprocessableEntityException('Cannot create sesh right now.');
    }
  }

  async rsvpForSesh(token: string, seshId: string): Promise<void> {
    const acceptedEvent = new SeshAcceptedEvent(token, seshId);

    await this.eventEmitter.emitAsync(
      SESH_EVENTS.USER_CONFIRMED,
      acceptedEvent,
    );
    return;
  }
}
