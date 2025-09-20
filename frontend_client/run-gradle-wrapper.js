import { spawn } from "child_process";
let gradleCommand;

if (process.platform === "win32") {
  gradleCommand = "gradlew.bat";
} else {
  gradleCommand = "./gradlew";
}

const child = spawn(
  gradleCommand,
  process.argv.slice(2),
  {
    stdio: "inherit",
    shell: true
  }
);
const promise = new Promise(
  function (resolve, reject) {
    child.on("exit",
      function (returnValue) {
	console.log("internal child died");
	resolve(returnValue);
      })
  }
);

const ret = await promise;
process.exit(ret);
