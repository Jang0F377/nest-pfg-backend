import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  PreconditionFailedException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './model/user.model';
import { Model } from 'mongoose';
import { UserWithPassword } from './model/user-with-password.model';
import { JwtService } from 'src/services/jwt/jwt.service';
import { PartialUserDto, UserDto } from './dto/user.dto';
import { UserProfile, Credentials } from 'src/types';
import { UserWithPasswordDto } from './dto/user-with-password.dto';
import { ROLES } from 'src/constants/user';
import { PasswordHasherService } from 'src/services/password-hasher/password-hasher.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(UserWithPassword.name)
    private userWithPassword: Model<UserWithPassword>,
    private jwtService: JwtService,
    private hasherService: PasswordHasherService,
  ) {}

  async returnCurrentUser(token: string): Promise<UserDto> {
    const parseToken = await this.jwtService.validateToken(token);
    const sub = this.grabIdFromSub(parseToken.sub);
    const itsMe = await this.userModel.findById(sub, '-role').exec();

    if (!itsMe) {
      throw new NotFoundException('User not found from token sub');
    }

    return itsMe;
  }

  async returnAllUsers(): Promise<UserDto[]> {
    return await this.userModel.find().exec();
  }

  async returnSpecificUser(id: string): Promise<UserDto> {
    const foundUser = await this.userModel.findById(id);

    if (!foundUser) {
      throw new NotFoundException('User not found');
    }
    return foundUser;
  }

  async loginUser(credentials: Credentials): Promise<string> {
    const user = await this.validateCredentials(credentials);
    const userProfile = this.convertToUserProfile(user);
    const token = await this.jwtService.generateToken(userProfile);
    return token;
  }

  async registerNewUser(credentials: Credentials): Promise<UserDto> {
    const userExists = await this.userModel
      .findOne({ email: credentials.email })
      .exec();

    if (userExists) {
      throw new BadRequestException(
        'A user with the provided email already exists. Maybe try logging in.',
      );
    }

    const saveThisUser: UserWithPasswordDto = {
      email: credentials.email,
      password: '',
      role: ROLES.USER,
    };
    const hashedPwd = await this.hasherService.hashPassword(
      credentials.password,
    );
    saveThisUser.password = hashedPwd;
    const saveUserToDb = await this.userWithPassword.create(saveThisUser);
    if (!saveUserToDb) {
      throw new PreconditionFailedException('Problem saving to user w/pwd db');
    }

    const { _id } = saveUserToDb;
    const userObject = Object.assign({}, { ...saveThisUser, _id: _id });
    return await this.userModel.create(userObject);
  }

  async updateCurrentUser(
    token: string,
    updatedUser: PartialUserDto,
  ): Promise<UserDto> {
    const { _id, role } = await this.returnCurrentUser(token);
    /* ROLE CHECK */
    if (role !== ROLES.ADMIN || ROLES.SUPER_ADMIN) {
      /* If not (super)admin these changes are not allowed */
      if (updatedUser.role || updatedUser.supporter) {
        throw new UnauthorizedException(
          'You are not authorized to make these changes!',
        );
      }
    }
    const updated = await this.userModel.findByIdAndUpdate(
      _id,
      { $set: updatedUser },
      { new: true },
    );
    return updated;
  }

  async resetUserDb(): Promise<Record<string, any>> {
    const [userDb, userWithPwdDb] = await Promise.all([
      await this.userModel.deleteMany(),
      await this.userWithPassword.deleteMany(),
    ]);
    return {
      userDb,
      userWithPwdDb,
    };
  }

  /* Private Helper Funcs for JWT functionality */
  convertToUserProfile(user: UserDto): UserProfile {
    return {
      sub: `${user._id}:${user.email}`,
      role: user.role,
    };
  }

  grabIdFromSub(sub: string): string {
    const id = sub.split(':')[0];
    return id;
  }

  async validateCredentials(credentials: Credentials): Promise<UserDto> {
    const findUser = await this.userWithPassword.findOne({
      email: credentials.email,
    });
    if (!findUser) {
      throw new HttpException(
        `Email: ${credentials.email} is not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    const { password } = findUser;
    const theyMatch = await this.hasherService.comparePasswords(
      credentials.password,
      password,
    );
    if (!theyMatch) {
      throw new UnauthorizedException('Email or Password Incorrect.');
    }
    return findUser;
  }
}
