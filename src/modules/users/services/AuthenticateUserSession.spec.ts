import AppError from '@shared/errors/AppError';

import FakeUserRepository from '../repositories/fakes/FakeUserRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import AuthenticateUserService from './AuthenticateUserSession';
import CreateUserService from './CreateUserService';

describe('AuthenticateSession', () => {
  it('Should be able to authenticate', async () => {
    const fakeUserRepository = new FakeUserRepository();
    const fakeHashProvider = new FakeHashProvider();

    const authenticateSession = new AuthenticateUserService(
      fakeUserRepository,
      fakeHashProvider,
    );

    const createUser = new CreateUserService(
      fakeUserRepository,
      fakeHashProvider,
    );

    const user = await createUser.execute({
      name: 'Henrique Manduca',
      email: 'henriquemanduca@live.com',
      password: '123456',
    });

    const response = await authenticateSession.execute({
      email: 'henriquemanduca@live.com',
      password: '123456',
    });

    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);
  });

  it('Should not be able to authenticate with non existing user', async () => {
    const fakeUserRepository = new FakeUserRepository();
    const fakeHashProvider = new FakeHashProvider();

    const authenticateSession = new AuthenticateUserService(
      fakeUserRepository,
      fakeHashProvider,
    );

    await expect(
      authenticateSession.execute({
        email: 'henriquemanduca@live.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able to authenticate with wrong password', async () => {
    const fakeUserRepository = new FakeUserRepository();
    const fakeHashProvider = new FakeHashProvider();

    const authenticateSession = new AuthenticateUserService(
      fakeUserRepository,
      fakeHashProvider,
    );

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
      authenticateSession.execute({
        email: 'henriquemanduca@live.com',
        password: 'xxxxx',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
