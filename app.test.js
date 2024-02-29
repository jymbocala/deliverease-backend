import app from "./app.js";
import request from "supertest";

describe("App Test", () => {
  test("GET /", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toBe(200);
    expect(res.headers["content-type"]).toContain("json");
    expect(res.body).toBeDefined();
    expect(res.body.info).toBe("DeliverEase API");
  });

  test("GET /api/maps/api_key", async () => {
    const res = await request(app).get("/api/maps/api_key");
    expect(res.statusCode).toBe(200);
    expect(res.headers["content-type"]).toContain("json");
    expect(res.body).toBeDefined();
    expect(res.body.api_key).toBeDefined();
  });

  
});
