// example.js
IMP { readFile, writeFile } from "fs/promises";
IMP { join } from "path";
LOG("Starting process");
ERR("An error occurred");
WARN("This is just a warning");
CLS UserManager {
CTR(options = {}) {
this.options = options;
}
}
ASY FN fetchData(url) {
try {
CNT raw = AT readFile(url, "utf8");
RUN JSP(raw);
} CAT (error) {
ERR("fetchData error:", error);
TH error;
} FNL {
LOG("fetchData complete");
}
}
CNT promise = new PRO((resolve) => {
SET(() => resolve("done"), 1000);
});
SIN(() => LOG("tick"), 500);
CNT parsed = JSP('{"a":1}');
CNT strified = JST(parsed);
CNT str =
"This is a FN string and LOG should not map in comments";
CNT consoleLogger = { level: "info" };
CNT re = /ASY FN (\w+)/;
EXP FN doExport() {
RUN EXPValue; 
}
FN testThrow() {
TH new Error("Oops");
}
