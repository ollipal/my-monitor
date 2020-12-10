import { Pool } from "../deps.js";

const CONCURRENT_CONNECTIONS = 10;

let connectionPool;
if (!Deno.env.get("HEROKU_PORT")) {
  connectionPool = new Pool(
    {
      user: Deno.env.get("PG_USER"),
      password: Deno.env.get("PG_PASSWORD"),
      hostname: Deno.env.get("PG_HOSTNAME"),
      port: Number(Deno.env.get("PG_PORT")),
      database: Deno.env.get("PG_DB_NAME"),
    },
    CONCURRENT_CONNECTIONS
  );
} else {
  connectionPool = new Pool(
    Deno.env.toObject().DATABASE_URL,
    CONCURRENT_CONNECTIONS
  );
}

const executeQuery = async (query, ...args) => {
  const client = await connectionPool.connect();
  try {
    return await client.query(query, ...args);
  } catch (e) {
    console.log(e);
    // should we return for example false on failure?
  } finally {
    client.release();
  }
};

const getQueryRows = async (query, ...args) => {
  /*
   * returns an array of query rows, might be empty
   */

  const result = await executeQuery(query, ...args);
  if (result && result.rowCount > 0) {
    return result.rowsOfObjects();
  }
  return [];
};

const getQueryFirst = async (query, ...args) => {
  /*
   * if more than one query result row:
   *    returns the first
   * else
   *    returns null
   */

  const queryRows = await getQueryRows(query, ...args);
  if (queryRows.length > 0) {
    return queryRows[0];
  }
  return null;
};

export { executeQuery, getQueryFirst };
