import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IUsersRepository from '../repositories/IUserRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

import User from '../infra/typeorm/entities/User';

interface IRequest {
  name: string;
  email: string;
  password: string;
}

@injectable()
class CreateUserService {
  constructor(
    @inject('UserRepository')
    private userRepository: IUsersRepository,
    @inject('HashProvider')
    private hahsProvider: IHashProvider,
  ) {}

  public async execute({ name, email, password }: IRequest): Promise<User> {
    const checkUserExists = await this.userRepository.findByMail(email);

    if (checkUserExists) {
      throw new AppError('Email address alredy used!');
    }

    const hashedPass = await this.hahsProvider.generateHash(password);

    const user = this.userRepository.create({
      name,
      email,
      password: hashedPass,
    });

    return user;
  }
}

export default CreateUserService;
