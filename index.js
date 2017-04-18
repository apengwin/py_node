/*Bacckground Cloud Function to be triggered by Cloud Storage.
 *
 * @param {object} event The Cloud Functions event.
 * @param {function} The callback function.
 */
const spawn = require('child-process-promise').spawn;
const Storage = require('@google-cloud/storage');

/*
exports.testName = function helloGCS (event, callback) {
    const file = event.data;
    const isDelete = file.resourceState === 'not_exists';

    if (isDelete) {
        console.log(`File ${file.name} deleted.`);
    } else {
        var pyshell = new PythonShell("hello.py");
        pyshell.on("message", function (message) {
            console.log(message);
        });
        pyshell.end(function(err) {
            if (err) {
                throw err;
            }
        });
    }
    callback();
};
*/

exports.HELLO = function HELLO (event, callback) {
  var promise = spawn("whoami");
  var childProcess = promise.childProcess;
  childProcess.stdout.on('data', function (data) {
    console.log('[spawn] stdouttttt: ', data.toString());
  });
  childProcess.stderr.on('data', function (data) {
    console.log('[spawn] stderr: ', data.toString());
  });

    promise.then(function(result) {
        console.log(result.stdout.toString());
    })
    .catch(function(err) {
        console.error(err.stderr);
    }); 
  callback();
}

exports.lightweight_tar = function lightweight_tar () {
  const bucketName = "allanpywrentest";
  const fileName = "lightweight.tar";

  const storage = Storage();
  const bucket = storage.bucket(bucketName);
  const file = bucket.file(fileName);
  const options = {
    destination: "/tmp/" + fileName
  }
  const dest = "/tmp";
  var LS_FIRST = spawn("ls", ["-lha", "/tmp"]);
  var childProc = LS_FIRST.childProcess;
  childProc.stdout.on('data', function (data) {
  console.log("[LS] stdoutttt: ", data.toString());
     });
  childProc.stderr.on('data', function (data) {
    console.log("[LS] stderr: ", data.toString());
  });
  LS_FIRST.then(function(result) {
    console.log(result.toString());
  });
/*
  return file.download(options)
    .then((err) => {
      console.log(`File %{file.name} downloaded to ${dest}.`);
      var LS_FIRST = spawn("ls", ["-lha", "/tmp"]);
      var childProc = LS_FIRST.childProcess;
      childProc.stdout.on('data', function (data) {
        console.log("[LS] stdoutttt: ", data.toString());
      });
      childProc.stderr.on('data', function (data) {
        console.log("[LS] stderr: ", data.toString());
      });
      LS_FIRST.then(function(result) {
        var promise = spawn("tar",  ["--no-same-owner", "-xvf", "/tmp/" + fileName, "-C", "/tmp"]);
        var childProcess = promise.childProcess;
        childProcess.stdout.on('data', function (data) {
          console.log('[spawn] stdoutttt: ', data.toString());
        });
        childProcess.stderr.on('data', function (data) {
          console.log('[spawn] stderr: ', data.toString());
        });
        promise.then(function(result) {
          console.log("promise then");
          console.log(result.stdout.toString());
          console.log("done");
        }).catch(function(err) {
          console.log("promise error");
          console.error("error " + err);
          console.log("done");
        });
    });
  });
*/
}

exports.lightweight_tar();
