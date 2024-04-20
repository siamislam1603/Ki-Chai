import seedServices from "./seedServices.js";
import seedUsers from "./seedUsers.js";

export default async function seed() {
  await Promise.all[(seedServices(), seedUsers())];
}
