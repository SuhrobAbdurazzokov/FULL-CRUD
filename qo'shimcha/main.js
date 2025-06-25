const { write, read } = require("./file");
const { createServer } = require("node:http");

const server = createServer(async (req, res) => {
  if (req.method === "POST" && req.url === "/") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", async () => {
      try {
        const cars = await read();
        const parsedBody = JSON.parse(body);

        const newCar = {
          id: !cars?.length ? 1 : cars.at(-1).id + 1,
          ...parsedBody,
        };

        cars.push(newCar);
        await write(cars);

        res.writeHead(201, { "content-type": "application/json" });
        return res.end(
          JSON.stringify({
            statusCode: 201,
            message: "success",
            data: newCar,
          })
        );
      } catch (error) {
        res.writeHead(500, { "content-type": "application/json" });
        res.end(
          JSON.stringify({
            statusCode: 500,
            message: error.message,
          })
        );
      }
    });
  }

  if (req.method === "GET" && req.url === "/") {
    try {
      const cars = await read();
      res.writeHead(200, { "content-type": "application/json" });
      return res.end(
        JSON.stringify({
          statusCode: 200,
          message: "success",
          data: cars,
        })
      );
    } catch (error) {
      return res.end(
        JSON.stringify({
          statusCode: 500,
          message: error.message,
        })
      );
    }
  }

  if (req.method === "GET" && req.url.startsWith("/id/")) {
    try {
      const id = req.url.split("/")[2];
      const cars = await read();
      const car = cars.find((car) => car.id === +id);
      if (!car) {
        res.writeHead(404, { "content-type": "application/json" });
        return res.end(
          JSON.stringify({
            statusCode: 404,
            message: `Car not found by id: ${id}`,
          })
        );
      }
      res.writeHead(200, { "content-type": "application/json" });
      return res.end(
        JSON.stringify({
          statusCode: 200,
          message: "success",
          data: car,
        })
      );
    } catch (error) {
      return res.end(
        JSON.stringify({
          statusCode: 500,
          message: error.message,
        })
      );
    }
  }

  if (req.method == "PUT" && req.url.startsWith("/id/")) {
    try {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk;
      });
      req.on("end", async () => {
        const id = req.url.split("/")[2];
        const cars = await read();
        const carIndex = cars.findIndex((car) => car.id === +id);
        if (carIndex === -1) {
          return res.end(
            JSON.stringify({
              statusCode: 404,
              message: `Fruit not found by ID: ${id}`,
            })
          );
        }

        const car = { id: cars[carIndex].id, ...JSON.parse(body) };
        cars[carIndex] = car;
        await write(cars);
        res.writeHead(200, { "content-type": "application/json" });
        return res.end(
          JSON.stringify({
            statusCode: 200,
            message: "success",
            data: car,
          })
        );
      });
    } catch (error) {
      return res.end(
        JSON.stringify({
          statusCode: 500,
          message: error.message,
        })
      );
    }
  }

  if (req.method === "DELETE" && req.url.startsWith("/id/")) {
    try {
      const id = req.url.split("/")[2];
      const cars = await read();
      const carIndex = cars.findIndex((car) => car.id === +id);
      if (carIndex === -1) {
        return res.end(
          JSON.stringify({
            statusCode: 404,
            message: `Fruit not found by ID: ${id}`,
          })
        );
      }
      cars.splice(carIndex, 1);
      await write(cars);
      res.writeHead(200, { "content-type": "application/json" });
      return res.end(
        JSON.stringify({
          statusCode: 200,
          message: "successfully deleted",
          data: {},
        })
      );
    } catch (error) {
      return res.end(
        JSON.stringify({
          statusCode: 500,
          message: error.message,
        })
      );
    }
  }
});

server.listen(3000, () => console.log(`Server running on 3000 port`));
