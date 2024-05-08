import { Job } from '@hokify/agenda';

export interface AgendaJob {
  name: string;
  job: (job: Job) => void | Promise<void>;
}
