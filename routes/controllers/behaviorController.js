import * as behaviorService from "../../services/behaviorService.js";

const handleGet = async ({ render }) => {
  render("index.ejs", { behaviors: await behaviorService.getAllBehaviors() });
};

export { handleGet };
