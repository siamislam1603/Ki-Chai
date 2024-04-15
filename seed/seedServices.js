import Service from "../models/Service.js";

const services = [
  "Plumber",
  "Technician",
  "Electrician",
  "Mechanic",
  "Furniture Assembly",
  "Moving Help",
];
export default async function seedServices() {
  const totalDocuments = await Service.countDocuments();
  if (totalDocuments) return;
  await Service.bulkWrite(
    services.map((item) => ({
      insertOne: {
        document: {
          service_type: item,
        },
      },
    }))
  );
}
