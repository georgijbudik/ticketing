import request from "supertest";
import { app } from "../../src/app";
import mongoose from "mongoose";

it("returns a 401 if the user if not authenticated", async () => {
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.getAuthCookie())
    .send({
      title: "fdfdsfd",
      price: 20,
    })
    .expect(201);
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .send({ title: "fdfdfd", price: 10 });
  expect(401);
});

it("returns a 401 if the user does not own the ticket", async () => {
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.getAuthCookie())
    .send({
      title: "fdfdsfd",
      price: 20,
    });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", global.getAuthCookie())
    .send({
      title: "tretretretr",
      price: 100,
    });
  expect(401);
});

it("returns a 400 if the user provides invalid title or price", async () => {
  const cookie = global.getAuthCookie();
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "",
      price: 20,
    })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "tretretretr",
      price: -10,
    });
  expect(400);
});

it("updates the ticket provided valid inputs", async () => {
  const cookie = global.getAuthCookie();
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "",
      price: 20,
    });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .send({ title: "new title", price: 100 })
    .expect(200);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send();

  expect(ticketResponse.body.title).toEqual("new title");
  expect(ticketResponse.body.price).toEqual(100);
});
