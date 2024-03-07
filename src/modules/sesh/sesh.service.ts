import {
  Inject,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PartialSeshDto, SeshDto } from './dto/sesh.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Sesh } from './model/sesh.model';
import mongoose, { Model } from 'mongoose';
import { SeshRepository } from './repositories/sesh.repository';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  SESH_EVENTS,
  SeshAcceptedEvent,
  SeshDeclinedEvent,
} from 'src/constants/events';
import { POPULATE_PATH_SESH, POPULATE_SELECT_SESH } from 'src/constants/user';

@Injectable()
export class SeshService {
  constructor(
    @InjectModel(Sesh.name) private seshModel: Model<Sesh>,
    @Inject(SeshRepository) private seshRepository: SeshRepository,
    private eventEmitter: EventEmitter2,
  ) {}

  /**
   * Retrieves a specific sesh by its ID.
   * @param id The ID of the sesh to retrieve.
   * @returns A promise that resolves with the details of the sesh.
   * @throws {NotFoundException} When the sesh cannot be found by the given ID.
   */
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

  /**
   * Creates a new sesh with the given details.
   * @param token A JWT token to authenticate the request.
   * @param sesh The sesh details to be created.
   * @returns A promise that resolves with the created sesh details.
   */
  async createNewSesh(token: string, sesh: SeshDto): Promise<SeshDto> {
    const finalizedSesh = await this.seshRepository.finalizeSeshDetails(
      token,
      sesh,
    );

    return finalizedSesh;
  }

  /**
   * RSVPs for a sesh indicating acceptance.
   * @param token A JWT token to authenticate the request.
   * @param seshId The ID of the sesh to RSVP for.
   * @returns A promise that resolves with the updated sesh details after accepting.
   * @throws {NotFoundException} When the sesh cannot be found by the given ID.
   */
  async rsvpForSesh(token: string, seshId: string): Promise<SeshDto> {
    // Validate Sesh exists - will throw 404 if not found.
    await this.getSesh(seshId);

    // Create event
    const acceptedEvent = new SeshAcceptedEvent(token, seshId);

    // Emit
    await this.eventEmitter.emitAsync(
      SESH_EVENTS.USER_CONFIRMED,
      acceptedEvent,
    );

    // Return the updated sesh
    const updatedSesh = await this.seshModel.findById(seshId).populate({
      path: POPULATE_PATH_SESH,
      select: POPULATE_SELECT_SESH,
    });

    if (!updatedSesh) {
      throw new NotFoundException();
    }

    return updatedSesh;
  }

  /**
   * Declines the RSVP for a sesh.
   * @param token A JWT token to authenticate the request.
   * @param seshId The ID of the sesh to decline.
   * @returns A promise that resolves with the updated sesh details after declining.
   * @throws {NotFoundException} When the sesh cannot be found by the given ID.
   */
  async declineRsvpForSesh(token: string, seshId: string): Promise<SeshDto> {
    // Validate Sesh exists - will throw 404 if not found.
    await this.getSesh(seshId);

    // Create event
    const declinedEvent = new SeshDeclinedEvent(token, seshId);
    // Emit
    await this.eventEmitter.emitAsync(SESH_EVENTS.USER_DECLINED, declinedEvent);

    // Return the updated sesh
    const updatedSesh = await this.seshModel.findById(seshId).populate({
      path: POPULATE_PATH_SESH,
      select: POPULATE_SELECT_SESH,
    });

    if (!updatedSesh) {
      throw new NotFoundException();
    }

    return updatedSesh;
  }

  /**
   * Confirms a user's participation in a sesh.
   * @param userId The user's ID as a MongoDB ObjectId.
   * @param sesh The ID of the sesh for which the user's participation is being confirmed.
   * @returns A promise that resolves with the updated sesh details.
   * @throws {UnprocessableEntityException} When the update operation fails.
   */
  async confirmUser(
    userId: mongoose.Types.ObjectId,
    sesh: string,
  ): Promise<SeshDto> {
    // Create a mongo ObjectId
    const seshId = new mongoose.Types.ObjectId(sesh);
    // try to update the sesh by pulling userId out
    // of unconfirmed and into confirmed
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
    } catch {
      throw new UnprocessableEntityException();
    }
  }

  /**
   * Declines a user's participation in a sesh.
   * @param userId The user's ID as a MongoDB ObjectId.
   * @param sesh The ID of the sesh for which the user's participation is being declined.
   * @returns A promise that resolves with the updated sesh details.
   * @throws {UnprocessableEntityException} When the update operation fails.
   */
  async declineUser(
    userId: mongoose.Types.ObjectId,
    sesh: string,
  ): Promise<SeshDto> {
    // turn the sesh string into mongo ObjectId
    const seshId = new mongoose.Types.ObjectId(sesh);
    // try to update the sesh by pulling userId out
    // of unconfirmed and into declined
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
            usersDeclined: userId,
          },
        },
        { new: true },
      );
    } catch {
      throw new UnprocessableEntityException();
    }
  }

  async updateSesh(
    token: string,
    sesh: string,
    updatedSesh: PartialSeshDto,
  ): Promise<SeshDto> {
    //TODO VALIDATION
    // turn the sesh string into mongo ObjectId
    const seshId = new mongoose.Types.ObjectId(sesh);

    const newSesh = await this.seshModel.findByIdAndUpdate(
      seshId,
      {
        $set: { updatedSesh, _updatedAt: new Date().toISOString() },
      },
      { new: true },
    );

    if (!newSesh) {
      throw new NotFoundException('Unable to find and update the sesh!');
    }

    return newSesh;
  }
}
