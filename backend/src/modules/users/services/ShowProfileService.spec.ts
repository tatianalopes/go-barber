import 'reflect-metadata';

import AppError from '@shared/errors/AppError';
import ShowProfileService from './ShowProfileService';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';

let fakeUsersRepository: FakeUsersRepository;

let showProfile: ShowProfileService;

describe('ShowProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();

    showProfile = new ShowProfileService(fakeUsersRepository);
  });

  it('should be able to show profile', async () => {
    const name = 'John Doe';
    const email = 'johndoe@example.com';
    const password = '123456';
    const user = await fakeUsersRepository.create({
      name,
      email,
      password,
    });

    const profile = await showProfile.execute({
      user_id: user.id,
    });

    expect(profile.name).toBe(name);
    expect(profile.email).toBe(email);
  });

  it('should not be able to show profile from a non-existing user', async () => {
    await expect(
      showProfile.execute({
        user_id: 'non-existing user ID',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
