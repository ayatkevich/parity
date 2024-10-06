import { PGlite, Results } from "@electric-sql/pglite";

export interface Database {
  pg: PGlite;
  sql: (sqlStrings: TemplateStringsArray, ...params: any[]) => Promise<Results["rows"]>;
}

export function prepareDatabase(): Database;

export function parity(
  definition: (sql: Database["sql"]) => Promise<void>,
  migrations: Array<(sql: Database["sql"]) => Promise<void>>
): Promise<void>;
