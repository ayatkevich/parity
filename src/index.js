import { diff, inspect, definition as pgDiffDefinition } from "@ayatkevich/pg-diff";
import { PGlite } from "@electric-sql/pglite";
import assert from "assert/strict";

export function prepareDatabase() {
  const pg = new PGlite();
  const sql = (...args) => pg.sql(...args).then((its) => its.rows);
  return { pg, sql };
}

export async function parity(definition, migrations) {
  const db1 = prepareDatabase();
  const db2 = prepareDatabase();
  await db1.pg.exec(pgDiffDefinition);
  await db2.pg.exec(pgDiffDefinition);
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
    await db1.pg.close();
    await db2.pg.close();
  }
}
