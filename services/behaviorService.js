import { executeQuery } from "../database/database.js";

const getAllBehaviors = async () => {
  const res = await executeQuery("SELECT * FROM behaviors");
  if (res && res.rowCount > 0) {
    return res.rowsOfObjects();
  }
  return [];
};

export { getAllBehaviors };
