const { writeFile, readFile } = require("node:fs/promises");
const { join } = require("node:path");

const path = join(__dirname, "./cars.json");

const write = async (data) => {
  try {
    await writeFile(path, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error(`Error writing to file: ${error.message}`);
    throw error; 
  }
};

const read = async () => {
  try {
    const data = await readFile(path, "utf8");
    return JSON.parse(data || "[]"); 
  } catch (error) {
    console.error(`Error reading from file: ${error.message}`);
    return []; 
  }
};

module.exports = {
  write,
  read,
};
