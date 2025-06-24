const { writeFile, readFile } = require("node:fs/promises");
const { join } = require("node:path");

const filePath = join(__dirname, "./fruits.json");

const write = async (data) => {
  try {
    await writeFile(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.log(`Error on write to file: ${error.message}`);
  }
};

const read = async () => {
  try {
    const data = await readFile(filePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.log(`Error on read from file: ${error.message}`);
  }
};

module.exports = {
  write,
  read,
};
