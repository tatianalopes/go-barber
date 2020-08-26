import 'reflect-metadata';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import ListProvidersService from './ListProvidersService';

let fakeUsersRepository: FakeUsersRepository;
let fakeCacheProvider: FakeCacheProvider;

let listProviders: ListProvidersService;

describe('ListProviders', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeCacheProvider = new FakeCacheProvider();

    listProviders = new ListProvidersService(
      fakeUsersRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to list the providers', async () => {
    const user1 = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });
    const user2 = await fakeUsersRepository.create({
      name: 'Tom Fletcher',
      email: 'tomfletcher@example.com',
      password: '123567',
    });
    const loggedUser = await fakeUsersRepository.create({
      name: 'Daniel Jones',
      email: 'dannyjones@example.com',
      password: '678905',
    });

    const provides = await listProviders.execute({
      user_id: loggedUser.id,
    });

    expect(provides).toEqual([user1, user2]);
  });
});
