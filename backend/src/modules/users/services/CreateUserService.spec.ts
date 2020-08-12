import "reflect-metadata";

import CreateUserService from './CreateUserService';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import AppError from "@shared/errors/AppError";

describe('CreateUser', () => {
  it('should be able to create a new user', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);

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
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);

    const name = 'John Doe';
    const email = 'johndoe@example.com';
    const password = '123456';
    await createUser.execute({
      name,
      email,
      password,
    });

    expect(createUser.execute({
      name,
      email,
      password,
    })).rejects.toBeInstanceOf(AppError);
  });
})
