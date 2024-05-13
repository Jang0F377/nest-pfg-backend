import { Agenda, Job } from '@hokify/agenda';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isSameHour } from 'date-fns';
import { Model, Types } from 'mongoose';
import { AGENDA_CONNECTION } from 'src/constants/agenda';
import { SESH_STATUS } from 'src/constants/user';
import { SeshDto } from 'src/modules/sesh/dto/sesh.dto';
import { Sesh } from 'src/modules/sesh/model/sesh.model';
import { User } from 'src/modules/user/model/user.model';
import { AgendaUri } from 'src/utils/agenda/agenda.provider';

@Injectable({ scope: Scope.DEFAULT })
export class AgendaService {
  agenda: Agenda;
  dateTimeFormat = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false,
    timeZone: 'America/Los_Angeles',
    timeZoneName: 'short',
  });
  constructor(
    @Inject(AGENDA_CONNECTION) private agendaUri: AgendaUri,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Sesh.name) private seshModel: Model<Sesh>,
  ) {
    this._init();
    this._jobMoveSeshesToFinished();
  }

  private _init() {
    if (!this.agenda) {
      this.agenda = new Agenda(this.agendaUri);
    }
    this._subscribeToEvents();
  }

  private _subscribeToEvents() {
    this.agenda.once('ready', async () => {
      console.log('Agenda connected to Db.');
      console.log('Starting Agenda...');
      await this.agenda.start();
      await this._defineAgendaJobs();
      await this._scheduleAgendaJobs();
    });
    this.agenda.on('error', (error: Error) => {
      console.log('Agenda ERR:', error);
    });
  }

  private async _defineAgendaJobs() {
    this.agenda.define('checkSeshes', async () => {
      this._jobMoveSeshesToFinished();
    });
  }

  private async _scheduleAgendaJobs() {
    this.agenda.every('1 minute', 'checkSeshes');
  }

  private _convertToMilitaryTime(time: string) {
    const isPM = time.split(' ')[1];
    const seshTime = time.split(' ')[0];
    let hour = +seshTime.split(':')[0];
    let minutes = time.split(':')[1].split(' ')[0];
    if (isPM === 'am') return seshTime;

    if (hour === 12) return seshTime;

    hour = hour + 12;
    return `${hour}:${minutes}`;
  }

  private async _jobMoveSeshesToFinished(): Promise<void> {
    const date = new Date();
    const dateStr = date.toDateString();
    const time = this.dateTimeFormat.format(date).slice(0, 5);
    const seshes = await this.seshModel
      .find({})
      .where('proposedDay')
      .equals(dateStr)
      .where('status')
      .equals(SESH_STATUS.NOT_STARTED);
    const pastSeshes = seshes.filter((sesh: Sesh) => {
      const seshTime = sesh.proposedTime;
      const militaryTime = this._convertToMilitaryTime(seshTime);
      return time >= militaryTime;
    });
    await this._moveToHistoryForAttendees(pastSeshes);
    await this._changeSeshStatus(pastSeshes);
  }

  private async _changeSeshStatus(seshes?: SeshDto[]): Promise<void> {
    seshes.forEach(async (sesh) => {
      await this.seshModel.findByIdAndUpdate(sesh._id, {
        $set: {
          status: SESH_STATUS.FINISHED,
        },
      });
    });
  }

  private async _moveToHistoryForAttendees(seshes?: SeshDto[]): Promise<void> {
    for (const sesh of seshes) {
      const seshId = sesh._id;
      const confirmedUsers = sesh.usersConfirmed.toString().split(',');
      const unconfirmedUsers = sesh.usersUnconfirmed;
      const declinedUsers = sesh.usersDeclined;

      console.log('confirmed', confirmedUsers);
      console.log('unconfirmed', unconfirmedUsers);
      console.log('declined', declinedUsers);
      console.log('declined', declinedUsers.length);
      if (unconfirmedUsers.length) {
        const unconfirmed = unconfirmedUsers.toString().split(',');
        await this._removeFromUpcomingUndecided(seshId, unconfirmed);
      }
      if (declinedUsers.length) {
        const declined = declinedUsers.toString().split(',');
        await this._removeFromUpcomingDeclined(seshId, declined);
      }
      await this._moveToHistory(seshId, confirmedUsers);
    }
  }

  private async _moveToHistory(
    seshId: Types.ObjectId,
    confirmedRecipients: string[],
  ): Promise<void> {
    try {
      for (const user of confirmedRecipients) {
        await this.userModel.findByIdAndUpdate(user, {
          $pull: {
            upcomingAcceptedSeshes: seshId,
          },
          $push: {
            seshHistory: seshId,
          },
        });
      }
    } catch (err) {
      throw new Error(err);
    }
  }

  private async _removeFromUpcomingUndecided(
    seshId: Types.ObjectId,
    undecidedRecipients?: string[],
  ): Promise<void> {
    try {
      for (const user of undecidedRecipients) {
        await this.userModel.findByIdAndUpdate(user, {
          $pull: {
            upcomingUndecidedSeshes: seshId,
          },
        });
      }
    } catch (err) {
      throw new Error(err);
    }
  }

  private async _removeFromUpcomingDeclined(
    seshId: Types.ObjectId,
    declinedRecipients?: string[],
  ): Promise<void> {
    try {
      for (const user of declinedRecipients) {
        await this.userModel.findByIdAndUpdate(user, {
          $pull: {
            upcomingDeclinedSeshes: seshId,
          },
        });
      }
    } catch (err) {
      throw new Error(err);
    }
  }
}
