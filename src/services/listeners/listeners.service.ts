import { Inject, Injectable } from '@nestjs/common';
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
  async handleUserConfirmedEvent(event: SeshAcceptedEvent) {
    const { _id } = await this.userService.returnCurrentUser(event.token);
    const sesh = await this.seshService.getSesh(event.seshId);
    console.log("EVENT REC'D: ", {
      _id,
      sesh,
    });
  }
}
