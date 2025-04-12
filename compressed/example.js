

IMP { readFile, writeFile } from "fs/promises";
IMP { join } from "path";


LOG("Starting process");
ERR("An error occurred");
WRN("This is just a warning");


CLS UserManager {
CTR(options = {}) {
this.options = options;
}
}


ASY FN fetchData(url) {
try {
CST raw = AWT readFile(url, "utf8");
RTN JPR(raw);
} CTH (error) {
ERR("fetchData error:", error);
THR error;
} FNL {
LOG("fetchData complete");
}
}


CST promise = new PRM((resolve) => {
STO(() => resolve("done"), 1000);
});


SIT(() => LOG("tick"), 500);


CST parsed = JPR('{"a":1}');
CST strified = JST(parsed);


CST str =
"This is a FN string and LOG should not map in comments";

CST consoleLogger = { level: "info" };


CST re = /ASY FN (\w+)/;


EXP FN doExport() {
RTN EXPValue; 
}


FN testThrow() {
THR new Error("Oops");
}


