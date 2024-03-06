import request from "supertest";
import { app } from "../../app";

it("returns a 201 on  successful signup", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "test@mail.com",
      password: "fdsfsdfsd",
    })
    .expect(201);
});

it("returns a 400 with an invalid email", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "test",
      password: "fdsfsdfsd",
    })
    .expect(400);
});

it("returns a 400 with an invalid password", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "test",
      password: "p",
    })
    .expect(400);
});

it("returns a 400 with missing email and password", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({ email: "test@mail.com" })
    .expect(400);
  await request(app)
    .post("/api/users/signup")
    .send({ password: "dfsdgsd" })
    .expect(400);
});

it("dissalows duplicate emails", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({ email: "test@mail.com", password: "dsfsdfds" })
    .expect(201);
  await request(app)
    .post("/api/users/signup")
    .send({ email: "test@mail.com", password: "dsfsdfds" })
    .expect(400);
});

it("sets a cookie after successful signup", async () => {
  const response = await request(app)
    .post("/api/users/signup")
    .send({ email: "test@mail.com", password: "dsfsdfds" })
    .expect(201);

  expect(response.get("Set-Cookie")).toBeDefined();
});
