export enum SESH_EVENTS {
  USER_CONFIRMED = 'event.user.confirmed',
  USER_DECLINED = 'event.user.declined',
  SESH_UPDATED = 'event.sesh.updated',
}

export class SeshAcceptedEvent {
  token: string;
  seshId: string;
  constructor(token: string, seshId: string) {
    this.token = token;
    this.seshId = seshId;
  }
}
