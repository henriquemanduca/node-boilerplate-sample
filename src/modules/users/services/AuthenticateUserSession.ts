import { sign } from 'jsonwebtoken';
import { injectable, inject } from 'tsyringe';

import authCfg from '@config/auth';

import AppError from '@shared/errors/AppError';
import IUsersRepository from '../repositories/IUserRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

import User from '../infra/typeorm/entities/User';

interface IRequest {
  email: string;
  password: string;
}

interface IResponse {
  user: User;
  token: string;
}

@injectable()
class AuthenticateUserService {
  constructor(
    @inject('UserRepository')
    private userRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({ email, password }: IRequest): Promise<IResponse> {
    const user = await this.userRepository.findByMail(email);

    if (!user) {
      throw new AppError('Incorret email/password combination.', 401);
    }

    const passMatched = await this.hashProvider.compareHash(
      password,
      user.password,
    );

    if (!passMatched) {
      throw new AppError('Incorret email/password combination.', 401);
    }

    const { secret, expiresIn } = authCfg.jwt;

    const token = sign({}, secret, {
      subject: user.id,
      expiresIn,
    });

    return {
      user,
      token,
    };
  }
}

export default AuthenticateUserService;
