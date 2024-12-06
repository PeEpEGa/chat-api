import { CreateUserDTO } from "../dtos/user-dtos/create-user.dto";
import { UserDTO } from "../dtos/user-dtos/user.dto";
import { User } from "../../domain/entities/user.entity";

export class UserMapper {
  //   static toDomain(dto: any): any {
  //     const user = new User(
  //       dto.id,
  //       dto.username,
  //       dto.name,
  //       dto.surname,
  //       dto.email,
  //       dto.password
  //     );
  //     return user;
  //   }

  static toDomain(data: CreateUserDTO): User {
    const { username, name, surname, email, password } = data;
    return new User("", username, name, surname, email, password);
  }

  static toDTO(user: User): UserDTO {
    return {
      id: user.Id,
      username: user.Username,
      name: user.Name,
      surname: user.Surname,
      email: user.Email,
      password: user.Password,
    };
  }
}
