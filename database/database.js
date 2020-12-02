import { Client, config } from "../deps.js";
const envConfig = config();

const getClient = () => {
  return new Client({
    user: envConfig.PG_USER,
    password: envConfig.PG_PASSWORD,
    hostname: envConfig.PG_HOSTNAME,
    port: Number(envConfig.PG_PORT),
    database: envConfig.PG_DB_NAME,
  });
};

const executeQuery = async (query, ...args) => {
  const client = getClient();
  try {
    await client.connect();
    return await client.query(query, ...args);
  } catch (e) {
    console.log(e);
  } finally {
    await client.end();
  }
};

export { executeQuery };
