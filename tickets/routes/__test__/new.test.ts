import request from "supertest";
import { app } from "../../src/app";
import { Ticket } from "../../models/ticket";

it("has a route handler listeting to /api/tickets for post requests", async () => {
  const response = await request(app).post("/api/tickets").send({});

  expect(response.status).not.toEqual(404);
});

it("can only be accessed if the user is signed in", async () => {
  await request(app).post("/api/tickets").send({}).expect(200);
});

it("returns a status other than 401 if the user is signed in", async () => {
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.getAuthCookie())
    .send({});

  expect(response.status).not.toEqual(401);
});

it("returns an error if an invalid title is provided", async () => {
  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.getAuthCookie())
    .send({
      title: "",
      price: 10,
    })
    .expect(400);
  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.getAuthCookie())

    .send({
      price: 10,
    })
    .expect(400);
});

it("returns an error if an invalid price is provided", async () => {
  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.getAuthCookie())

    .send({
      title: "gfdgfdgdf",
      price: -10,
    })
    .expect(400);
  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.getAuthCookie())

    .send({
      title: "gfdgfdgdf",
    })
    .expect(400);
});

it("creates a ticket with valid inputs", async () => {
  let tickets = await Ticket.find({});

  const title = "gfdgfdgdf";
  expect(tickets.length).toEqual(0);
  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.getAuthCookie())
    .send({
      title,
      price: 10,
    })
    .expect(201);

  tickets = await Ticket.find({});
  console.log(tickets[0].price);
  expect(tickets.length).toEqual(1);
  expect(tickets[0].title).toEqual(title);

  expect(tickets[0].price).toEqual(10);
});
