import { Injectable } from '@nestjs/common';
import { SeshDto } from 'src/modules/sesh/dto/sesh.dto';

@Injectable()
export class DateParserService {
  public async parseDate(sesh: SeshDto): Promise<SeshDto> {
    const day = sesh.proposedDay;
    console.log('day', day);
    return sesh;
  }
}
