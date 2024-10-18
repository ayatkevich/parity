export interface Database {
  sql: (
    sqlStrings: TemplateStringsArray,
    ...params: any[]
  ) => Promise<{
    [key: string]: any;
  }>;
}

export function parity(
  definition: (sql: Database["sql"]) => Promise<any>,
  migrations: Array<(sql: Database["sql"]) => Promise<any>>
): Promise<void>;
