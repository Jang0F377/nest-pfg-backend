import {
  Inject,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { SeshDto } from './dto/sesh.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Sesh } from './model/sesh.model';
import mongoose, { Model } from 'mongoose';
import { SeshRepository } from './repositories/sesh.repository';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SESH_EVENTS, SeshAcceptedEvent } from 'src/constants/events';
import { POPULATE_PATH_SESH, POPULATE_SELECT_SESH } from 'src/constants/user';

@Injectable()
export class SeshService {
  constructor(
    @InjectModel(Sesh.name) private seshModel: Model<Sesh>,
    @Inject(SeshRepository) private seshRepository: SeshRepository,
    private eventEmitter: EventEmitter2,
  ) {}

  async getSesh(id: string): Promise<SeshDto> {
    const sesh = await this.seshModel.findById(id).populate({
      path: POPULATE_PATH_SESH,
      select: POPULATE_SELECT_SESH,
    });

    if (!sesh) {
      throw new NotFoundException('Sesh not found by Id');
    }

    return sesh;
  }

  async createNewSesh(token: string, sesh: SeshDto): Promise<SeshDto> {
    const finalizedSesh = await this.seshRepository.finalizeSeshDetails(
      token,
      sesh,
    );

    return finalizedSesh;
  }

  async rsvpForSesh(token: string, seshId: string): Promise<any> {
    // Create event
    const acceptedEvent = new SeshAcceptedEvent(token, seshId);

    // Emit
    return await this.eventEmitter.emitAsync(
      SESH_EVENTS.USER_CONFIRMED,
      acceptedEvent,
    );
  }

  async confirmUser(
    userId: mongoose.Schema.Types.ObjectId,
    sesh: string,
  ): Promise<SeshDto> {
    const seshId = new mongoose.Types.ObjectId(sesh);
    try {
      return await this.seshModel.findByIdAndUpdate(
        seshId,
        {
          $set: {
            _updatedAt: new Date().toISOString(),
          },
          $pull: {
            usersUnconfirmed: userId,
          },
          $push: {
            usersConfirmed: userId,
          },
        },
        { new: true },
      );
    } catch (err) {
      throw new UnprocessableEntityException(err);
    }
  }
}
