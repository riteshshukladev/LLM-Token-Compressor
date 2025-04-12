

import { readFile, writeFile } from "fs/promises";
import { join } from "path";


console.log("Starting process");
console.error("An error occurred");
console.warn("This is just a warning");


class UserManager {
constructor(options = {}) {
this.options = options;
}
}


async function fetchData(url) {
try {
const raw = await readFile(url, "utf8");
return JSON.parse(raw);
} catch (error) {
console.error("fetchData error:", error);
throw error;
} finally {
console.log("fetchData complete");
}
}


const promise = new Promise((resolve) => {
setTimeout(() => resolve("done"), 1000);
});


setInterval(() => console.log("tick"), 500);


const parsed = JSON.parse('{"a":1}');
const strified = JSON.stringify(parsed);


const str =
"This is a function string and console.log should not map in comments";

const consoleLogger = { level: "info" };


const re = /async function (\w+)/;


export function doExport() {
return exportValue; 
}


function testThrow() {
throw new Error("Oops");
}


