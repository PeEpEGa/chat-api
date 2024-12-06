import { IIdGenerator } from "./interfaces/id-generator.interface";
import { v7 as uuidv7 } from "uuid";

export class UuidV7Generator implements IIdGenerator {
  generateId(): string {
    return uuidv7();
  }
}
