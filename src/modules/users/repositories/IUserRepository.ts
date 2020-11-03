import User from '../infra/typeorm/entities/User';
import ICreateUserDTO from '../dtos/ICreateUsersDTO';

export default interface IUserRepository {
  findById(id: string): Promise<User | undefined>;
  findByMail(email: string): Promise<User | undefined>;
  create(data: ICreateUserDTO): Promise<User>;
  save(user: ICreateUserDTO): Promise<User>;
}
