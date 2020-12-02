import * as newsService from "../../services/behaviorService.js";

const getAllBehaviors = async ({ response }) => {
  response.body = await newsService.getAllBehaviors();
};

export { getAllBehaviors };
