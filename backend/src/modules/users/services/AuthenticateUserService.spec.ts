import "reflect-metadata";

import CreateUserService from './CreateUserService';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import AuthenticateUserService from './AuthenticateUserService';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import AppError from "@shared/errors/AppError";

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;

let createUser: CreateUserService;
let authenticateUser: AuthenticateUserService;

describe('AuthenticateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);
    authenticateUser = new AuthenticateUserService(fakeUsersRepository, fakeHashProvider);
  });

  it('should be able to authenticate', async () => {
    const name = 'John Doe';
    const email = 'johndoe@example.com';
    const password = '123456';

    const user = await createUser.execute({
      name,
      email,
      password,
    });

    const response = await authenticateUser.execute({
      email,
      password,
    })

    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);
  });

  it('should not be able to authenticate with non existing user', async () => {
    const email = 'johndoe@example.com';
    const password = '123456';

    await expect(authenticateUser.execute({
      email,
      password,
    })).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate with wrong password', async () => {
    const name = 'John Doe';
    const email = 'johndoe@example.com';
    const password = '123456';

    await createUser.execute({
      name,
      email,
      password,
    });

    await expect(authenticateUser.execute({
      email,
      password: 'wrong-password',
    })).rejects.toBeInstanceOf(AppError);
  });
})
