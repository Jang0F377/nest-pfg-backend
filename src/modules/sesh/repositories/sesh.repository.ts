import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  RequestTimeoutException,
} from '@nestjs/common';
import { UserService } from 'src/modules/user/user.service';
import { SeshDto } from '../dto/sesh.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Sesh } from '../model/sesh.model';
import mongoose, { Model } from 'mongoose';
import { UserDto } from 'src/modules/user/dto/user.dto';
import { USER_SESH_PROJECTION } from 'src/constants/user';

@Injectable()
export class SeshRepository {
  constructor(
    @Inject(UserService) private userService: UserService,
    @InjectModel(Sesh.name) private seshModel: Model<Sesh>,
  ) {}

  /**
   * Finalizes the details of a session (sesh) before creation.
   * This includes setting the session's sender, confirming the user as a participant,
   * and validating recipients.
   *
   * @param token The JWT token of the user creating the session.
   * @param sesh The session data transfer object (DTO) containing the session details.
   * @returns A promise that resolves with the details of the created session.
   * @throws {NotFoundException} If the user associated with the token cannot be found.
   */
  public async finalizeSeshDetails(
    token: string,
    sesh: SeshDto,
  ): Promise<SeshDto> {
    const user = await this.userService.returnCurrentUser(
      token,
      USER_SESH_PROJECTION.concat(['-__v', '-email']),
    );
    if (!user) {
      throw new NotFoundException('User Not Found');
    }
    /* Set Sesh sentFrom to the creating User */
    sesh.sentFrom = user._id;
    sesh.usersConfirmed = [user._id];
    sesh = await this.validateRecipients(sesh.recipients, sesh);

    try {
      const createdSesh = await this.seshModel.create(sesh);

      await this.handleAddToRecipients(sesh.recipients, createdSesh._id);
      await this.handleAddToSendersAcceptedPool(sesh.sentFrom, createdSesh._id);
      return createdSesh;
    } catch (err) {
      console.log('ERROR', err);
    }
  }

  /**
   * Validates the recipients of a session to ensure they are valid users.
   * Updates the session DTO with the list of validated recipients and marks them as unconfirmed.
   *
   * @param recipients An array of recipient IDs to be validated.
   * @param sesh The session data transfer object (DTO) being prepared.
   * @returns A promise that resolves with the updated session DTO.
   * @throws {BadRequestException} If no recipients could be validated.
   */
  private async validateRecipients(
    recipients: mongoose.Types.ObjectId[],
    sesh: SeshDto,
  ): Promise<SeshDto> {
    let validatedRecipients: mongoose.Types.ObjectId[] = [];
    let setUsersUnconfirmed: mongoose.Types.ObjectId[] = [];
    const results = recipients.map(async (recipient) => {
      const user = await this.userService.getUserByEmail(
        recipient.toString(),
        USER_SESH_PROJECTION.concat(['-__v', '-email', '-role']),
      );
      if (user) {
        validatedRecipients.push(user._id);
        setUsersUnconfirmed.push(user._id);
      }
    });
    await Promise.allSettled(results);

    if (!validatedRecipients.length) {
      throw new BadRequestException('No recipients were validated');
    }
    sesh.recipients = validatedRecipients;
    sesh.usersUnconfirmed = setUsersUnconfirmed;

    return sesh;
  }

  /**
   * Adds the session to the undecided pool of each recipient.
   *
   * @param recipients An array of recipient IDs to add the session to.
   * @param seshId The ID of the session being added.
   * @returns A promise that resolves when the session has been added to all recipients' undecided pools.
   */
  private async handleAddToRecipients(
    recipients: mongoose.Types.ObjectId[],
    seshId: mongoose.Types.ObjectId,
  ): Promise<void> {
    for await (const recipient of recipients) {
      await this.userService.addSeshtoUsersUndecidedPool(recipient, seshId);
    }
  }

  /**
   * Adds the session to the accepted pool of the sender.
   *
   * @param id The ID of the sender to whom the session is to be added.
   * @param seshId The ID of the session being added.
   * @returns A promise that resolves when the session has been added to the sender's accepted pool.
   * @throws {RequestTimeoutException} If adding the session to the sender's accepted pool fails.
   * @private
   */
  private async handleAddToSendersAcceptedPool(
    id: mongoose.Types.ObjectId,
    seshId: mongoose.Types.ObjectId,
  ): Promise<void> {
    try {
      await this.userService.handleAddToSendersAcceptedPool(id, seshId);
    } catch {
      throw new RequestTimeoutException(
        'Unable to add to senders accepted pool',
      );
    }
  }
}
