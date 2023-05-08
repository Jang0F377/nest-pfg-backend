import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from 'src/modules/user/user.service';
import { SeshDto } from '../dto/sesh.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Sesh } from '../model/sesh.model';
import { Model } from 'mongoose';
import { UserDto } from 'src/modules/user/dto/user.dto';
import { USER_SESH_PROJECTION } from 'src/constants/user';

@Injectable()
export class SeshRepository {
  constructor(
    @Inject(UserService) private userService: UserService,
    @InjectModel(Sesh.name) private seshModel: Model<Sesh>,
  ) {}

  /* 
    When a Sesh is created it needs to parse the time and day
    It needs to notify the recipients by placing the sesh in their
    upcomingUndecidedSeshes
  */
  public async finalizeSeshDetails(
    token: string,
    sesh: SeshDto,
  ): Promise<SeshDto> {
    const user = await this.userService.returnCurrentUser(
      token,
      USER_SESH_PROJECTION,
    );
    if (!user) {
      throw new NotFoundException('User Not Found');
    }
    /* Set Sesh sentFrom to the creating User */
    sesh.sentFrom = user._id;
    sesh.usersConfirmed = [user];
    sesh = await this.validateRecipients(sesh.recipients, sesh);

    const createdSesh = await this.seshModel.create(sesh);

    await this.handleAddToRecipients(sesh.recipients, createdSesh);
    await this.handleAddToSendersPool(sesh.sentFrom, createdSesh);
    return createdSesh;
  }

  private async validateRecipients(
    recipients: Array<string>,
    sesh: SeshDto,
  ): Promise<SeshDto> {
    let validatedRecipients: Array<string> = [];
    let setUsersUnconfirmed: Array<UserDto> = [];
    const results = recipients.map(async (recipient) => {
      const user = await this.userService.getUserByEmail(
        recipient,
        USER_SESH_PROJECTION.concat(['-role']),
      );
      if (user) {
        validatedRecipients.push(user._id);
        setUsersUnconfirmed.push(user);
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

  private async handleAddToRecipients(
    recipients: Array<string>,
    sesh: SeshDto,
  ): Promise<void> {
    for await (const recipient of recipients) {
      await this.userService.addSeshtoUsersUndecidedPool(recipient, sesh);
    }
  }

  private async handleAddToSendersPool(
    id: string,
    sesh: SeshDto,
  ): Promise<void> {
    try {
      await this.userService.addSeshToUsersAcceptedPool(id, sesh);
    } catch (err) {
      console.log('ERROR adding to senders accepted pool');
    }
  }
}
