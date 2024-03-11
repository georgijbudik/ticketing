import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

declare global {
  var getAuthCookie: () => string[];
}

let mongo: any;
beforeAll(async () => {
  process.env.JWT_KEY = "asdfdfd";
  mongo = await MongoMemoryServer.create();

  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri);
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }

  await mongoose.connection.close();
});

global.getAuthCookie = () => {
  const payload = {
    id: "fdsfdsgd",
    email: "test@mail.com",
  };

  const session = {
    jwt: jwt.sign(payload, process.env.JWT_KEY!),
  };

  const sessionJSON = JSON.stringify(session);

  const base64 = Buffer.from(sessionJSON).toString("base64");

  return [`session=${base64}`];
};
