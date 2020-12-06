import { Client } from "../deps.js";

const _getClient = () => {
  return new Client({
    user: Deno.env.get("PG_USER"),
    password: Deno.env.get("PG_PASSWORD"),
    hostname: Deno.env.get("PG_HOSTNAME"),
    port: Number(Deno.env.get("PG_PORT")),
    database: Deno.env.get("PG_DB_NAME"),
  });
};

const executeQuery = async (query, ...args) => {
  const client = _getClient();
  try {
    await client.connect();
    return await client.query(query, ...args);
  } catch (e) {
    console.log(e);
    // should we return for example false on failure?
  } finally {
    await client.end();
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

export { executeQuery, getQueryFirst, getQueryRows };
