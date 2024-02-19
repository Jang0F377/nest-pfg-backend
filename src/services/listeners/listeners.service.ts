import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { SESH_EVENTS, SeshAcceptedEvent } from 'src/constants/events';
import { SeshService } from 'src/modules/sesh/sesh.service';
import { UserService } from 'src/modules/user/user.service';

@Injectable()
export class ListenersService {
  constructor(
    @Inject(UserService) private userService: UserService,
    @Inject(SeshService) private seshService: SeshService,
  ) {}

  @OnEvent(SESH_EVENTS.USER_CONFIRMED)
  async handleUserConfirmedEvent(event: SeshAcceptedEvent): Promise<any> {
    /**
     * When someone accepts a Sesh:
     * 1. On sesh itself move from unconfirmed to confirmed.
     * 2. On user move from their undecided to accepted.
     * 3. Notify creator and/or other recipients.
     */

    // get user
    const acceptingUser = await this.userService.returnCurrentUser(event.token);
    // get unconfirmed users array from the sesh
    const { usersUnconfirmed } = await this.seshService.getSesh(event.seshId);

    // Validate that the user is in the unconfirmed array
    const verifyUserInvite = usersUnconfirmed.some((x, idx) => {
      return x._id.toString() === acceptingUser._id.toString();
    });

    // Throw if not found
    if (!verifyUserInvite) {
      throw new UnauthorizedException('User is not invited to requested sesh.');
    }

    // 1. Sesh - move from unconfirmed to confirmed.
    await this.seshService.confirmUser(acceptingUser._id, event.seshId);

    // 2. User - move from undecided to accepted.
    await this.userService.moveFromUndecidedToAccepted(
      acceptingUser._id,
      event.seshId,
    );
  }
}
