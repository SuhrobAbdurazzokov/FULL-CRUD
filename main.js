const { error } = require("node:console");
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
        const fruits = await read();
        const newFruit = {
          id: !fruits?.length ? 1 : fruits.at(-1)?.id + 1,
          ...JSON.parse(body),
        };
        fruits.push(newFruit);
        write(fruits);
        res.writeHead(201, { "content-type": "application/json" });
        return res.end(
          JSON.stringify({
            statusCode: 201,
            message: "success",
            data: newFruit,
          })
        );
      } catch (error) {
        res.writeHead(500, { "content-type": "application/json" });
        return res.end(
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
      const fruits = await read();
      res.writeHead(200, { "content-type": "application/json" });
      return res.end(
        JSON.stringify({
          statusCode: 200,
          message: "success",
          data: fruits,
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

  if (req.method === "GET" && req.url.startsWith("/id")) {
    try {
      const id = req.url.split("/")[2];
      const fruits = await read();
      const fruit = fruits.find((fruit) => fruit.id === +id);
      if (!fruit) {
        res.writeHead(404, { "content-type": "application/json" });
        return res.end(
          JSON.stringify({
            statusCode: 404,
            message: `Fruit not found by ID ${id}`,
          })
        );
      }
      res.writeHead(200, { "content-type": "application/json" });
      return res.end(
        JSON.stringify({
          statusCode: 200,
          message: "success",
          data: fruit,
        })
      );
    } catch (error) {
      return res.end(
        JSON.stringify({
          statusCode: 404,
          message: error.message,
        })
      );
    }
  }

  if (req.method === "PUT" && req.url.startsWith("/id")) {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", async () => {
      try {
        const id = req.url.split("/")[2];
        const fruits = await read();
        const fruitIndex = fruits.findIndex((fruit) => fruit.id === +id);
        if (fruitIndex === -1) {
          res.writeHead(404, { "content-type": "application/json" });
          return res.end(
            JSON.stringify({
              statusCode: 404,
              message: `Fruit not found by ID: ${id}`,
            })
          );
        }

        const fruit = { id: fruits[fruitIndex].id, ...JSON.parse(body) };
        fruits[fruitIndex] = fruit;
        await write(fruits);
        res.writeHead(200, { "content-type": "application/json" });
        return res.end(
          JSON.stringify({
            statusCode: 200,
            message: "success",
            data: fruit,
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
    });
  }

  if (req.method === "DELETE" && req.url.startsWith("/id")) {
    try {
      const id = req.url.split("/")[2];
      const fruits = await read();
      const fruitIndex = fruits.findIndex((fruit) => fruit.id === +id);

      if (fruitIndex === -1) {
        res.writeHead(404, { "content-type": "application/json" });
        return res.end(
          // mevaning o‘rnini o‘chir
          JSON.stringify({
            statusCode: 404,
            message: `Fruit not found by ID ${id}`,
          })
        );
      }

      fruits.splice(fruitIndex, 1);
      await write(fruits);

      res.writeHead(200, { "content-type": "application/json" });
      return res.end(
        JSON.stringify({
          statusCode: 200,
          message: "successfully deleted",
          data: {},
        })
      );
    } catch (error) {
      res.writeHead(500, { "content-type": "application/json" });
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
