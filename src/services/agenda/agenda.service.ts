import { Agenda, Job } from '@hokify/agenda';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isSameHour } from 'date-fns';
import { Model } from 'mongoose';
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
    this._changeSeshStatus(pastSeshes);
    this._moveToHistoryForAttendees(pastSeshes);
  }

  private async _changeSeshStatus(seshes: SeshDto[]): Promise<void> {
    seshes.forEach(async (sesh) => {
      await this.seshModel.findByIdAndUpdate(sesh._id, {
        $set: {
          status: SESH_STATUS.FINISHED,
        },
      });
    });
  }

  private async _moveToHistoryForAttendees(seshes: SeshDto[]): Promise<void> {
    console.log(this._moveToHistoryForAttendees.name, seshes);
  }
}
