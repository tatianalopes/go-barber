import "reflect-metadata";

import ResetPasswordService from './ResetPasswordService';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import AppError from "@shared/errors/AppError";
import FakeUserTokensRepository from "../repositories/fakes/FakeUserTokensRepository";
import FakeHashProvider from "../providers/HashProvider/fakes/FakeHashProvider";

let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let fakeHashProvider: FakeHashProvider;

let resetPassword: ResetPasswordService;

describe('ResetPassword', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeUserTokensRepository = new FakeUserTokensRepository();
    fakeHashProvider = new FakeHashProvider();

    resetPassword = new ResetPasswordService(fakeUsersRepository, fakeUserTokensRepository, fakeHashProvider);
  });

  it('should be able to reset the password', async () => {
    const name = 'John Doe';
    const email = 'johndoe@example.com';
    const password = '123456';

    const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');

    const user = await fakeUsersRepository.create({
      name,
      email,
      password,
    });

    const { token } = await fakeUserTokensRepository.generate(user.id);

    const newPassword = '123123';
    await resetPassword.execute({
      token,
      password: newPassword,
    });

    const updatedUser = await fakeUsersRepository.findById(user.id);

    expect(generateHash).toHaveBeenCalledWith(newPassword);
    expect(updatedUser?.password).toBe(newPassword);
  });

  it('should not be able to reset the password with non-existing token', async () => {
    const token = 'non-existing-token';
    const password = '123456';

    await expect(
      resetPassword.execute({
        token,
        password,
    })).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to reset the password with non-existing user', async () => {
    const userId = 'non-existing-user';
    const password = '123456';

    const { token } = await fakeUserTokensRepository.generate(userId);

    await expect(
      resetPassword.execute({
        token,
        password,
    })).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to reset the password if passed more than 2 hours', async () => {
    const name = 'John Doe';
    const email = 'johndoe@example.com';
    const password = '123456';

    const user = await fakeUsersRepository.create({
      name,
      email,
      password,
    });

    const { token } = await fakeUserTokensRepository.generate(user.id);

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const customDate = new Date();

      return customDate.setHours(customDate.getHours() + 3);
    });

    const newPassword = '123123';
    await expect(
      resetPassword.execute({
        token,
        password: newPassword,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
})
