export interface ISession {
  startTransaction(): Promise<void>;
  commitTransaction(): Promise<void>;
  abortTransaction(): Promise<void>;
  endSession(): Promise<void>;
}

export interface ISessionFactory {
  startSession(): Promise<ISession>;
}
