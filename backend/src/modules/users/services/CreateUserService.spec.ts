import 'reflect-metadata';

import AppError from '@shared/errors/AppError';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import CreateUserService from './CreateUserService';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let fakeCacheProvider: FakeCacheProvider;

let createUser: CreateUserService;

describe('CreateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    fakeCacheProvider = new FakeCacheProvider();

    createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
      fakeCacheProvider,
    );
  });

  it('should be able to create a new user', async () => {
    const name = 'John Doe';
    const email = 'johndoe@example.com';
    const password = '123456';
    const user = await createUser.execute({
      name,
      email,
      password,
    });

    expect(user).toHaveProperty('id');
  });

  it('should not be able to create a new user with same email from another', async () => {
    const name = 'John Doe';
    const email = 'johndoe@example.com';
    const password = '123456';
    await createUser.execute({
      name,
      email,
      password,
    });

    await expect(
      createUser.execute({
        name,
        email,
        password,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
