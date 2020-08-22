import 'reflect-metadata';

import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import AppError from '@shared/errors/AppError';
import UpdateUserAvatarService from './UpdateUserAvatarService';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';

let fakeUsersRepository: FakeUsersRepository;
let fakeStorageProvider: FakeStorageProvider;

let updateUserAvatar: UpdateUserAvatarService;

describe('UpdateUserAvatar', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeStorageProvider = new FakeStorageProvider();

    updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    );
  });

  it('should be able to update user avatar', async () => {
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
    const avatar = 'avatar.jpg';

    await expect(
      updateUserAvatar.execute({
        user_id: 'non-existing-user',
        avatar_filename: avatar,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should delete old avatar when updating new one', async () => {
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

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
});
