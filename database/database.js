import { Client, config } from "../deps.js";
const envConfig = config();

const _getClient = () => {
  return new Client({
    user: envConfig.PG_USER,
    password: envConfig.PG_PASSWORD,
    hostname: envConfig.PG_HOSTNAME,
    port: Number(envConfig.PG_PORT),
    database: envConfig.PG_DB_NAME,
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
