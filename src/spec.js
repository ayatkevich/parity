import { describe, test } from "@jest/globals";
import { parity, prepareDatabase } from "./index.js";

describe("parity", () => {
  const { pg, sql } = prepareDatabase();
  afterAll(() => pg.close());

  test("empty", async () => {
    await parity(async (sql) => sql``, [async (sql) => sql``]);
  });
});
