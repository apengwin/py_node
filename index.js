/*Bacckground Cloud Function to be triggered by Cloud Storage.
 *
 * @param {object} event The Cloud Functions event.
 * @param {function} The callback function.
 */
const spawn = require('child-process-promise').spawn;
const Storage = require('@google-cloud/storage');

exports.neitzsche = function HELLO (event, callback) {
  // You are root. The ubermensch
  var promise = spawn("whoami");
  var childProcess = promise.childProcess;

  childProcess.stdout.on('data', function (data) {
    console.log('[spawn] stdout: ', data.toString());
  });
  childProcess.stderr.on('data', function (data) {
    console.log('[spawn] stderr: ', data.toString());
  });

  promise.then(function(result) {
    console.log(result.stdout.toString());
  }).catch(function(err) {
    console.error(err.stderr);
  }); 
  callback();
}

exports.lightweight_tar = function lightweight_tar () {
  const bucketName = "allanpywrentest";
  const fileName = "condaruntime.tar.xz";

  const conda_path = "/tmp/condaruntime/bin";

  const storage = Storage();
  const bucket = storage.bucket(bucketName);
  const file = bucket.file(fileName);
  const dest = "/tmp/";
  const options = {
    destination: dest + fileName
  }

  return file.download(options)
    .then((err) => {
      console.log(`File %{file.name} downloaded to ${dest}.`);

      //for record-keeping purposes, list the contents of /tmp
      var LS_FIRST = spawn("ls", ["-lha", "/tmp"]);
      var childProc = LS_FIRST.childProcess;
  
      childProc.stdout.on('data', function (data) {
        console.log("[LS] stdout: ", data.toString());
      });
      childProc.stderr.on('data', function (data) {
        console.log("[LS] stderr: ", data.toString());
      });

      LS_FIRST.then(function(result) {
        // tar without attempting to chown, because we can't chown.
        var TAR = spawn("tar",  ["--no-same-owner", "-xvf", "/tmp/" + fileName, "-C", "/tmp"]);
        var childProcess = TAR.childProcess;

        childProcess.stdout.on('data', function (data) {
          console.log('[TAR] stdout: ', data.toString());
        });
        childProcess.stderr.on('data', function (data) {
          console.log('[TAR] stderr: ', data.toString());
        });

        TAR.then(function() {
          // for record-keeping purposes, list the contents after /tmp after untarring.
          var LS_SECOND = spawn("ls", ["-lha", "/tmp"]);
          var secondChildProc = LS_SECOND.childProcess;

          secondChildProc.stdout.on('data', function(data) {
            console.log("[LS_after] stdout: ", data.toString());
          });
          secondChildProc.stderr.on('data', function(data) {
            console.log("[LS_after] stderr: ", data.toString());
          });
          second_promise.then(function() {
            var attempt_python = spawn("conda_path" + "/python", ["/tmp/lightweight/hello.py"]);
            var pythonProc = attempt_python.childProcess;
            pythonProc.stdout.on('data', function(data) {
              console.log("[PYTHON] stdout: ", data.toString());
            });
            pythonProc.stderr.on('data', function(data) {
              console.log("[PYTHON] stderr: ", data.toString());
            });
          });

        }).catch(function(err) {
          console.log("promise error");
          console.error('ERR: ', err);
          console.log("done");
        });
    });
  });
}

exports.list = function list(event, callback) {
  var LS_COMMAND = spawn("ls", ["-lha", "/tmp"]);
  var childProc = LS_COMMAND.childProcess;

  childProc.stdout.on('data', function (data) {
    console.log("[LS] stdout: ", data.toString());
  });
  childProc.stderr.on('data', function (data) {
    console.log("[LS] stderr: ", data.toString());
  });

  LS_COMMAND.then(function(result) {
    console.log(result.toString());
  });
}
