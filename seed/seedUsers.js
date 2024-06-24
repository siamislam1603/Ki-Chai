import Service from "../models/Service.js";
import User from "../models/User.js";
import Vendor from "../models/Vendor.js";
import Specialist from "../models/Specialist.js";
import { generateHashedPassword } from "../controllers/authController.js";

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

const getEncryptedPassword=async(password)=>{
  return await generateHashedPassword(password);
}
export default async function seedUsers() {
  return;
  const users = [];
  const services = await Service.find().select("_id").lean();
  const password=await getEncryptedPassword('adminpass')
  console.log(password)

  // Create vendors
  for (let i = 0; i < 50; i++) {
    const vendor = await Vendor.create({
      per_hour_rate: Math.floor(Math.random() * 100) + 50, // Random rate between 50 and 150
      company_reg_certificate:
        "http://localhost:3500/public/uploads/nid_picture/order_phase_bg-1713347882550.jpg",
      user_description: `Vendor description ${i + 1}`,
      is_available_for_emergency: i % 2 === 0, // Alternate availability
      interests: services.slice(0, getRandomInt(services.length) + 1),
    });

    const user = await User.create({
      first_name: `Vendor${i}`,
      last_name: `Doe`,
      email: `vendor${i}@example.com`,
      password: password,
      city: "New York",
      postcode: 12345,
      phone: `123456780${i}`,
      profile:
        "http://localhost:3500/public/uploads/nid_picture/order_phase_bg-1713347882550.jpg",
      is_verified: true,
      vendor: vendor._id, // Reference to the created vendor
    });

    users.push(user);
  }

  // Create specialists
  for (let i = 0; i < 50; i++) {
    const specialist = await Specialist.create({
      per_hour_rate: Math.floor(Math.random() * 100) + 50, // Random rate between 50 and 150
      nid_picture: [
        "http://localhost:3500/public/uploads/nid_picture/order_phase_bg-1713347882550.jpg",
        "http://localhost:3500/public/uploads/nid_picture/order_phase_bg-1713347882550.jpg",
      ],
      user_description: `Specialist description ${i + 1}`,
      is_available_for_emergency: i % 2 === 0, // Alternate availability
      interests: services.slice(0, getRandomInt(services.length) + 1),
    });

    const user = await User.create({
      first_name: `Specialist${i}`,
      last_name: `Doe`,
      email: `specialist${i}@example.com`,
      password: password,
      city: "Los Angeles",
      postcode: 54321,
      phone: `098765432${i}`,
      profile: `Specialist profile ${i + 1}`,
      is_verified: true,
      specialist: specialist._id, // Reference to the created specialist
    });

    users.push(user);
  }

  // Create customers
  await User.bulkWrite(
    Array.from({ length: 50 }, (_, i) => ({
      insertOne: {
        document: {
          first_name: `Customer${i}`,
          last_name: `Doe`,
          email: `customer${i}@example.com`,
          password: password,
          city: "Los Angeles",
          postcode: 54321,
          phone: `018765432${i}`,
          profile:
            "http://localhost:3500/public/uploads/nid_picture/order_phase_bg-1713347882550.jpg",
          is_verified: true,
        },
      },
    }))
  );
}
