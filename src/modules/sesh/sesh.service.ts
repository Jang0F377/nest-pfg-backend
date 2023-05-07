import { BadRequestException, Injectable } from '@nestjs/common';
import { SeshDto } from './dto/sesh.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Sesh } from './model/sesh.model';
import { Model } from 'mongoose';
import { UserService } from '../user/user.service';

@Injectable()
export class SeshService {
  constructor(
    @InjectModel(Sesh.name) private seshModel: Model<Sesh>,
    private userService: UserService,
  ) {}

  async createNewSesh(token: string, sesh: SeshDto): Promise<SeshDto> {
    const { _id } = await this.userService.returnCurrentUser(token);
    try {
      sesh.sentFrom = _id;
      const newSesh = await this.seshModel.create(sesh);
      // Handle putting sesh into upcomingSeshes for recipients and creator
      return newSesh;
    } catch (err) {
      throw new BadRequestException('Sesh cannot be created. please try again');
    }
  }
}
