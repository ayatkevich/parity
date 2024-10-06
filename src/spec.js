import { describe, expect, test } from "@jest/globals";
import { parity } from "./index.js";

describe("parity", () => {
  test("empty", async () => {
    await parity(async (sql) => sql``, [async (sql) => sql``]);
  });

  test("migrations", async () => {
    await parity(
      async (sql) => sql`
        create table users (
          id serial primary key,
          name text not null
        );
      `,
      [
        async (sql) => sql`
          create table users ();
        `,
        async (sql) => sql`
          alter table users add column id serial primary key;
        `,
        async (sql) => sql`
          alter table users add column name text not null;
        `,
      ]
    );
  });

  test("error", async () => {
    await expect(
      parity(
        async (sql) => sql`
          create table users (
            id serial primary key,
            name text not null
          );
        `,
        [async (sql) => sql``]
      )
    ).rejects.toThrow();
  });
});
