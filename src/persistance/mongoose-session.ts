import { ClientSession, startSession } from "mongoose";
import { ISession, ISessionFactory } from "./interfaces/session.interface";

class MongooseSession implements ISession {
  constructor(private readonly _clientSession: ClientSession) {}

  async startTransaction(): Promise<void> {
    this._clientSession.startTransaction();
  }

  async commitTransaction(): Promise<void> {
    this._clientSession.commitTransaction();
  }

  async abortTransaction(): Promise<void> {
    this._clientSession.abortTransaction();
  }

  async endSession(): Promise<void> {
    this._clientSession.endSession();
  }

  getClientSession(): ClientSession {
    return this._clientSession;
  }
}

class MongooseSessionFactory implements ISessionFactory {
  async startSession(): Promise<ISession> {
    const clientSession = await startSession();
    return new MongooseSession(clientSession);
  }
}

export { MongooseSessionFactory };
