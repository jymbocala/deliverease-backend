import app from "./app.js";
import request from "supertest";

const serverURL = "https://deliverease-api.onrender.com";

describe("App Test", () => {
  test("GET /", async () => {
    const res = await request(app).get("/");

    // Check if the response status code is 200
    expect(res.statusCode).toBe(200);
    // Check if the response contains JSON data
    expect(res.headers["content-type"]).toContain("json");
    // Check if the response contains the expected data
    expect(res.body).toBeDefined();
    // Check if the response contains the expected data
    expect(res.body.info).toBe("DeliverEase API");
  });

  test("GET /api/maps/api_key", async () => {
    const res = await request(app).get("/api/maps/api_key");
    expect(res.statusCode).toBe(200);
    expect(res.headers["content-type"]).toContain("json");
    expect(res.body).toBeDefined();
    expect(res.body.api_key).toBeDefined();
  });

  test("GET /api/maps/api_key", async () => {
    const res = await request(serverURL).get("/api/maps/api_key");

    expect(res.statusCode).toBe(200);
    expect(res.headers["content-type"]).toContain("json");
    expect(res.body).toBeDefined();
    expect(res.body.api_key).toBeDefined();
  }, 10000);
});

describe("User Routes Test", () => {
  test("POST /api/users/new with an already exiting user", async () => {
    const userData = { email: "test121@example.com", password: "Test1!" };
    const res = await request(serverURL).post("/users/new").send(userData);

    // // Check if the response status code is 400
    expect(res.statusCode).toBe(400);

    // // Check if the response contains JSON data
    expect(res.headers["content-type"]).toContain("json");
  }, 10000);

  test("POST /login", async () => {
    // Prepare user credentials
    const userCredentials = {
      email: "deliverease2@gmail.com",
      password: "password2",
    };

    // Send a POST request to login the user
    const response = await request(serverURL)
      .post("/users/login")
      .send(userCredentials);

    expect(response.statusCode).toBe(200);
    expect(response.headers["content-type"]).toContain("json");
    expect(response.body.token).toBeDefined();
    expect(response.body.userId).toBeDefined();
  }, 10000);
});

describe("Location Routes", () => {
  let token;

  // Before running tests, authenticate the user and get the token
  beforeAll(async () => {
    // Prepare user credentials   
    const userCredentials = {
      email: "deliverease2@gmail.com",
      password: "password2",
    };
    // Log in the user and get the token
    const response = await request(serverURL)
      .post("/users/login")
      .send(userCredentials);
    token = response.body.token;
  });

  // Test getting all locations
  test("GET /locations", async () => {
    const response = await request(serverURL)
      .get("/locations")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Array);

  }, 20000);

  // Test getting a location by ID
  test('GET /locations/:id', async () => {
    const locationIdExample = "65e140a740559e604e688050";
    const response = await request(serverURL)
      .get(`/locations/${locationIdExample}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('_id');
  }, 10000);
});
