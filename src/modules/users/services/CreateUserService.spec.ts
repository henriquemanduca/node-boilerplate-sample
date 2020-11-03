import AppError from '@shared/errors/AppError';

import FakeUserRepository from '../repositories/fakes/FakeUserRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

import CreateUserService from './CreateUserService';

describe('CreateUser', () => {
  it('Should be able to create a new user', async () => {
    const fakeUserRepository = new FakeUserRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createUser = new CreateUserService(
      fakeUserRepository,
      fakeHashProvider,
    );

    const user = await createUser.execute({
      name: 'Henrique Manduca',
      email: 'henriquemanduca@live.com',
      password: '123456',
    });

    expect(user).toHaveProperty('id');
  });

  it('Should not be able to create a user with same e-mail than other', async () => {
    const fakeUserRepository = new FakeUserRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createUser = new CreateUserService(
      fakeUserRepository,
      fakeHashProvider,
    );

    await createUser.execute({
      name: 'Henrique Manduca',
      email: 'henriquemanduca@live.com',
      password: '123456',
    });

    await expect(
      createUser.execute({
        name: 'Henrique Silva',
        email: 'henriquemanduca@live.com',
        password: '456123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
