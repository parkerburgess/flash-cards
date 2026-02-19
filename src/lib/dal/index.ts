import type { IDataAccess } from "./IDataAccess";
import { JsonDataAccess } from "./JsonDataAccess";

// Singleton — swap this one line to migrate to a database adapter
const dal: IDataAccess = new JsonDataAccess();

export default dal;
