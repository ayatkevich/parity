import { Results } from "@electric-sql/pglite";

export interface Database {
  sql: (sqlStrings: TemplateStringsArray, ...params: any[]) => Promise<Results["rows"]>;
}

export function parity(
  definition: (sql: Database["sql"]) => Promise<any>,
  migrations: Array<(sql: Database["sql"]) => Promise<any>>
): Promise<void>;
