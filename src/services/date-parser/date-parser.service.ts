import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
} from '@nestjs/common';
import { SeshDto } from 'src/modules/sesh/dto/sesh.dto';
import { getDay, isFuture, isValid, startOfTomorrow } from 'date-fns';

@Injectable()
export class DateParserService {
  /**
   * Determines the date for the given sesh
   * Date can come in as: today | tomorrow | MM/DD/YYYY
   * Necessary Steps:
   * 1. Determine if today/tomorrow or date format.
   * 2. If today/tomorrow:
   *    - determine date
   *    - determine day (monday,tuesday,etc)
   *    - and attach date to proposedDay property
   * 3. If date format:
   *    - Verify date is in future
   *    - Technically could still be today or tomorrow in date format.
   *    - Determine day (monday,tuesday,etc.)
   *    - attach date/day to proposedDay property
   */
  public parseDate(sesh: SeshDto): SeshDto {
    const day = sesh.proposedDay;
    let date = new Date(day);
    // Determine if dateformat or not
    const isDate = isValid(date);

    if (isDate) {
      this._verifyDate(date);
      sesh.proposedDay = date.toDateString();
    } else {
      day.toLowerCase();
      date = new Date();
      // We can assume that the value is either today or tomorrow
      if (day === 'tomorrow') {
        const tomorrow = startOfTomorrow().toDateString();
        sesh.proposedDay = tomorrow;
      } else {
        sesh.proposedDay = date.toDateString();
      }
    }

    return sesh;
  }

  private _verifyDate(date: Date): void {
    const future = isFuture(date);
    if (!future) {
      throw new BadRequestException('Given date needs to be in the future.');
    }
  }
}
