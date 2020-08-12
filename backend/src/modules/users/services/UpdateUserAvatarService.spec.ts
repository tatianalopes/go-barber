import "reflect-metadata";

import UpdateUserAvatarService from './UpdateUserAvatarService';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import AppError from "@shared/errors/AppError";

describe('UpdateUserAvatar', () => {
  it('should be able to update user avatar', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeStorageProvider = new FakeStorageProvider();

    const updateUserAvatar = new UpdateUserAvatarService(fakeUsersRepository, fakeStorageProvider);

    const name = 'John Doe';
    const email = 'johndoe@example.com';
    const password = '123456';
    const avatar = 'avatar.jpg';

    const user = await fakeUsersRepository.create({
      name,
      email,
      password,
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatar_filename: avatar,
    });

    expect(user.avatar).toBe(avatar);
  });

  it('should not be able to update avatar from non existing user', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeStorageProvider = new FakeStorageProvider();

    const updateUserAvatar = new UpdateUserAvatarService(fakeUsersRepository, fakeStorageProvider);

    const avatar = 'avatar.jpg';

    expect(updateUserAvatar.execute({
      user_id: 'non-existing-user',
      avatar_filename: avatar,
    })).rejects.toBeInstanceOf(AppError);
  });

  it('should delete old avatar when updating new one', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeStorageProvider = new FakeStorageProvider();

    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const updateUserAvatar = new UpdateUserAvatarService(fakeUsersRepository, fakeStorageProvider);

    const name = 'John Doe';
    const email = 'johndoe@example.com';
    const password = '123456';
    const avatar = 'avatar.jpg';
    const newAvatar = 'avatar2.jpg';

    const user = await fakeUsersRepository.create({
      name,
      email,
      password,
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatar_filename: avatar,
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatar_filename: newAvatar,
    });

    expect(deleteFile).toHaveBeenCalledWith(avatar);
    expect(user.avatar).toBe(newAvatar);
  });
})
