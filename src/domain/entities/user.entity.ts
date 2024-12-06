export class User {
  private _id: string;
  private _username: string;
  private _name: string;
  private _surname: string;
  private _email: string;
  private _password: string;

  constructor(
    id: string,
    username: string,
    name: string,
    surname: string,
    email: string,
    password: string
  ) {
    this._id = id;
    this._username = username;
    this._name = name;
    this._surname = surname;
    this._email = email;
    this._password = password;
  }

  public get Id() {
    return this._id;
  }

  public get Username() {
    return this._username;
  }

  public get Name() {
    return this._name;
  }

  public get Surname() {
    return this._surname;
  }

  public get Email() {
    return this._email;
  }

  public get Password() {
    return this._password;
  }

  public toJSON() {
    return {
      id: this._id,
      username: this._username,
      name: this._name,
      surname: this._surname,
      email: this._email,
      password: this._password,
    };
  }
}
