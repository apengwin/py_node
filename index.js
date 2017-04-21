/*Bacckground Cloud Function to be triggered by Cloud Storage.
 *
 * @param {object} event The Cloud Functions event.
 * @param {function} The callback function.
 */
const spawn = require('child-process-promise').spawn;
const Storage = require('@google-cloud/storage');

exports.lightweight_tar = function lightweight_tar (event, callback) {
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
  console.log("starting");
  file.download(options)
    .then((err) => {
      console.log(`File %{file.name} downloaded to ${dest}.`);

      // tar without attempting to chown, because we can't chown.
      var TAR = spawn("tar",  ["--no-same-owner", "-xzf", "/tmp/" + fileName, "-C", "/tmp"]);
      var childProcess = TAR.childProcess;
      console.log("Attempting to untar...");

       /* uncommenting this is a bad idea. IPC slows down everything.
       childProcess.stdout.on('data', function (data) {
         console.log('[TAR] stdout: ', data.toString());
       });
       childProcess.stderr.on('data', function (data) {
         console.log('[TAR] stderr: ', data.toString());
       });
       */

       TAR.then(function() {
         console.log("finished untarring");

         // for record-keeping purposes, list the contents after /tmp after untarring.
         var LS_SECOND = spawn("ls", ["-lha", conda_path]);
         var secondChildProc = LS_SECOND.childProcess;

         secondChildProc.stdout.on('data', function(data) {
           console.log("[LS_after] stdout: ", data.toString());
         });
         secondChildProc.stderr.on('data', function(data) {
           console.log("[LS_after] stderr: ", data.toString());
         });

         LS_SECOND.then(function() {
           var attempt_python = spawn(conda_path + "/python", ["helper.py"]);
           var pythonProc = attempt_python.childProcess;

           pythonProc.stdout.on('data', function(data) {
              console.log("[PYTHON] stdout: ", data.toString());
           });
           pythonProc.stderr.on('data', function(data) {
             console.log("[PYTHON] stderr: ", data.toString());
           });

           attempt_python.catch(function(err) {
             console.error("Python err: ", err);
           });
           callback();
         });

       }).catch(function(err) {
         console.error('ERR: ', err);
         callback(1);
       });
 //   });
  }).catch(function(err) {
    console.error("Error: ", err);
    callback(1);
  });
}

/* Utility functions to figure out what's going on under the hood, 
 * since I haven't figured out how to ssh onto a GCF vm
 */

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
