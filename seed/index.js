import seedServices from "./seedServices.js";

export default async function seed() {
  await Promise.all[seedServices()];
}
