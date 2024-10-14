import { definitionPath, diff, inspect } from "@ayatkevich/pg-diff";
import postgresLite from "@ayatkevich/postgres-lite";
import assert from "assert/strict";

export async function parity(definition, migrations) {
  const db1 = { sql: postgresLite() };
  const db2 = { sql: postgresLite() };
  await db1.sql.file(definitionPath);
  await db2.sql.file(definitionPath);
  try {
    await definition(db1.sql);
    const fromDefinition = await inspect(db1.sql);
    for (const migration of migrations) {
      await migration(db2.sql);
    }
    const fromMigrations = await inspect(db2.sql);
    const diffs = await diff(db1.sql, { left: fromDefinition, right: fromMigrations });
    assert.deepEqual(diffs, []);
  } finally {
    await db1.sql.end();
    await db2.sql.end();
  }
}
