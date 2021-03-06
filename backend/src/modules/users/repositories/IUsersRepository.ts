import User from '../infra/typeorm/entities/User';
import ICreateUserDto from '../dtos/ICreateUserDto';
import IFindAllProvidersDto from '../dtos/IFindAllProvidersDto';

export default interface IUsersRepository {
  create(data: ICreateUserDto): Promise<User>;
  update(user: User): Promise<User>;
  findById(id: string): Promise<User | undefined>;
  findByEmail(email: string): Promise<User | undefined>;
  findAllProviders(data: IFindAllProvidersDto): Promise<User[]>;
}
