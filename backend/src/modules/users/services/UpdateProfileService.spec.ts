import 'reflect-metadata';

import AppError from '@shared/errors/AppError';
import UpdateProfileService from './UpdateProfileService';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;

let updateProfile: UpdateProfileService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    updateProfile = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to update the profile', async () => {
    const name = 'John Doe';
    const email = 'johndoe@example.com';
    const password = '123456';
    const user = await fakeUsersRepository.create({
      name,
      email,
      password,
    });

    const newName = 'John Jones';
    const newEmail = 'johnjones@example.com';
    const updateUser = await updateProfile.execute({
      user_id: user.id,
      name: newName,
      email: newEmail,
    });

    expect(updateUser.name).toBe(newName);
    expect(updateUser.email).toBe(newEmail);
  });

  it('should not be able to update profile from a non-existing user', async () => {
    const name = 'John Doe';
    const email = 'johndoe@example.com';
    await expect(
      updateProfile.execute({
        user_id: 'non-existing user ID',
        name,
        email,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to chanbge to another user email', async () => {
    const name1 = 'John Doe';
    const email1 = 'johndoe@example.com';
    const password1 = '123456';
    const user1 = await fakeUsersRepository.create({
      name: name1,
      email: email1,
      password: password1,
    });

    const name2 = 'Louis Smith';
    const email2 = 'louissmith@example.com';
    const password2 = '123123';
    const user2 = await fakeUsersRepository.create({
      name: name2,
      email: email2,
      password: password2,
    });

    await expect(
      updateProfile.execute({
        user_id: user2.id,
        name: name1,
        email: email1,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update the password', async () => {
    const name = 'John Doe';
    const email = 'johndoe@example.com';
    const password = '123456';
    const user = await fakeUsersRepository.create({
      name,
      email,
      password,
    });

    const newName = 'John Jones';
    const newEmail = 'johnjones@example.com';
    const newPassword = '123123';
    const updateUser = await updateProfile.execute({
      user_id: user.id,
      name: newName,
      email: newEmail,
      old_password: password,
      password: newPassword,
    });

    expect(updateUser.password).toBe(newPassword);
  });

  it('should not be able to update the password without old password', async () => {
    const name = 'John Doe';
    const email = 'johndoe@example.com';
    const password = '123456';
    const user = await fakeUsersRepository.create({
      name,
      email,
      password,
    });

    const newName = 'John Jones';
    const newEmail = 'johnjones@example.com';
    const newPassword = '123123';
    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: newName,
        email: newEmail,
        password: newPassword,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the password with wrong old password', async () => {
    const name = 'John Doe';
    const email = 'johndoe@example.com';
    const password = '123456';
    const user = await fakeUsersRepository.create({
      name,
      email,
      password,
    });

    const newName = 'John Jones';
    const newEmail = 'johnjones@example.com';
    const newPassword = '123123';
    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: newName,
        email: newEmail,
        old_password: 'wrong_password',
        password: newPassword,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
