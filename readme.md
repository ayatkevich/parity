# Database Schema Parity Checker

Ensure your database migrations are in sync with your idempotent schema definitions through comprehensive schema diffing.

## Introduction

In modern software development, managing database schemas is a critical yet challenging task. As applications evolve, databases undergo numerous changes through migrations—incremental scripts that alter the schema to accommodate new features or modifications. Simultaneously, teams often maintain an idempotent schema definition—a single script that sets up the database from scratch.

The challenge lies in ensuring that the cumulative effect of all migrations matches the intended final schema defined by the idempotent script. Divergence between the two can lead to inconsistencies, deployment failures, and hard-to-track bugs.

**Database Schema Parity Checker** is a library that addresses this challenge by applying both the migrations and the schema definition to separate in-memory databases, capturing their schemas, and diffing them. If no differences are found, it confirms that your migrations and schema definition are in sync.

## Installation

Install the package via npm:

```bash
npm install @ayatkevich/parity
```

## Usage

Here's how you can use the library in your project:

```javascript
import { parity } from "@ayatkevich/parity";

await parity(
  async (sql) => {
    // Your idempotent schema definition
    await sql`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL
      );
    `;
  },
  [
    // Your sequence of migrations
    async (sql) => {
      await sql`CREATE TABLE users ();`;
    },
    async (sql) => {
      await sql`ALTER TABLE users ADD COLUMN id SERIAL PRIMARY KEY;`;
    },
    async (sql) => {
      await sql`ALTER TABLE users ADD COLUMN name TEXT NOT NULL;`;
    },
  ]
);
```

## Understanding Schema Diffing

### The Challenge of Schema Evolution

As applications grow and requirements change, database schemas must adapt. This evolution is typically managed through migrations—scripts that incrementally modify the database schema. Over time, the number of migrations can become substantial, making it difficult to ensure that the cumulative effect matches the intended final schema.

Simultaneously, developers maintain an idempotent schema definition, which represents the desired end state of the database. Ensuring that this definition is consistent with the migrations is essential for:

- **Setting up new environments**: Using the schema definition to initialize databases.
- **Disaster recovery**: Restoring databases to a known good state.
- **Continuous integration**: Verifying that changes do not introduce schema inconsistencies.

### Ensuring Parity Between Migrations and Schema Definitions

Discrepancies between migrations and schema definitions can lead to:

- **Inconsistent environments**: Different team members or environments may have divergent schemas.
- **Deployment failures**: Unexpected schema differences can cause deployments to fail.
- **Data integrity issues**: Mismatches might result in missing constraints or incorrect data types.

My library ensures parity by:

1. **Applying the Idempotent Schema Definition**: We apply your schema definition to an in-memory database and capture its schema.
2. **Applying the Migrations**: We apply your sequence of migrations to another in-memory database and capture its schema.
3. **Diffing the Schemas**: We compare the two schemas to identify any differences.

If the schemas are identical, your migrations and schema definition are in sync. If not, the diff highlights the discrepancies for you to address.

### How Schema Diffing Works Under the Hood

1. **Schema Inspection**: After applying the schema definition and migrations, the library inspects both in-memory databases to extract their schemas. This involves querying system catalogs to retrieve metadata about tables, columns, indexes, constraints, etc.

2. **Serialization**: The extracted schemas are serialized into a consistent format, typically a JSON representation, to facilitate comparison.

3. **Diff Calculation**: A diffing algorithm compares the serialized schemas, identifying additions, deletions, or modifications.

4. **Reporting**: If differences are found, they are reported in a structured manner, highlighting exactly what parts of the schema are out of sync.

### Benefits of Schema Diffing

- **Early Error Detection**: Identify schema inconsistencies during development rather than after deployment.
- **Increased Confidence**: Assure that your migrations and schema definitions produce the same result.
- **Documentation**: Serve as up-to-date documentation of the intended database schema.
- **Team Alignment**: Keep all team members on the same page regarding database structure.

## Examples

### Testing for Parity with Jest

You can integrate parity checks into your test suite to automatically verify schema consistency:

```javascript
import { parity } from "database-schema-parity-checker";

describe("Database Schema Parity", () => {
  test("should have matching schemas", async () => {
    await parity(
      async (sql) => {
        await sql`
          CREATE TABLE products (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL,
            price DECIMAL NOT NULL
          );
        `;
      },
      [
        async (sql) => {
          await sql`CREATE TABLE products ();`;
        },
        async (sql) => {
          await sql`ALTER TABLE products ADD COLUMN id SERIAL PRIMARY KEY;`;
        },
        async (sql) => {
          await sql`ALTER TABLE products ADD COLUMN name TEXT NOT NULL;`;
        },
        async (sql) => {
          await sql`ALTER TABLE products ADD COLUMN price DECIMAL NOT NULL;`;
        },
      ]
    );
  });
});
```

### Handling Schema Differences

If schemas do not match, the `parity` function throws an error. You can catch and inspect this error to understand the discrepancies:

```javascript
try {
  await parity(definition, migrations);
} catch (error) {
  console.error("Schema mismatch detected:", error);
  // Further error handling...
}
```

## License

This project is licensed under the MIT License. See the [license](license) file for details.
