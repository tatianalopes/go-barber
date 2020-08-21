import "reflect-metadata";

import ListProvidersService from "./ListProvidersService";
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';

let fakeUsersRepository: FakeUsersRepository;

let listProviders: ListProvidersService;

describe('ListProviders', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();

    listProviders = new ListProvidersService(fakeUsersRepository);
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
})
