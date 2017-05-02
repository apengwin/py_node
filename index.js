/*Bacckground Cloud Function to be triggered by Cloud Storage.
 *
 * @param {object} event The Cloud Functions event.
 * @param {function} The callback function.
 */
const spawn = require('child-process-promise').spawn;
const Storage = require('@google-cloud/storage');

exports.wrenhandler = function wrenhandler (req, res) {

  response = {"Exception": null};

  const bucketName = "allanpywrentest";
  const runtimeName = "condaruntime.tar.xz";
  const conda_path = "/tmp/condaruntime/bin";
  const storage = Storage();
  const bucket = storage.bucket(bucketName);
  const runtime = bucket.file(runtimeName);

  const func_filename = "/tmp/func.pickle";
  const data_filename = "/tmp/data.pickle";
  const output_filename = "/tmp/output.pickle";

  const dest = "/tmp/";
  options = {
    destination: dest + fileName
  }
  response["start_time"] = new Date().getTime()/1000;
  console.log("starting");
  runtime.download(options)
    .then((err) => {
      console.log(`File %{file.name} downloaded to ${dest}.`);

      // tar without attempting to chown, because we can't chown.
      var TAR = spawn("tar",  ["--no-same-owner", "-xzf", "/tmp/" + fileName, "-C", "/tmp"]);
      var childProcess = TAR.childProcess;
      console.log("Attempting to untar...");

      TAR.then((err) => {
        console.log("finished untarring");
   
        const func_bucket = storage.bucket(req.body.func_key[0]);
        const func = func_bucket.file(req.body.func_key[1]);
        options = {
          destionation : func_filename
        }
        func.download(options)
          .then((err) => {
            const data_bucket = storage.bucket(req.body.data_key[0]);
            const data = data_bucket.file(req.body.data_key[1]);
            options = {
              destionation: data_filename
            }
            data.download(options)
              .then((err) => {
                var attempt_python = spawn(conda_path + "/python", ["jobrunner.py", func_filename, data_filename, output_filename]);
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
               const output_bucket = storage.bucket(req.body.output_key[0]);
               output_bucket.upload(output_file, {dest: output_key[1]})
                 .then((err) => {
                   res.send("ok");
                 }).catch((err) => {
                      console.error('Err: ', err);
                      res.send("fail");
                 });
               }).catch(function(err) {
                 console.error('error downloading data: ', err);
                 res.send("fail");
               });
           }).catch(function(err) {
             console.error('ERR: ', err);
             res.send("fail");
           });
        }).catch(function(err) {
          console.error("Error: ", err);
          res.send("fail");
        });
   }).catch(function(err) {
     console.error("error downloading runtime");
     res.send("fail");
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

exports.OS = function list(event, callback) {
  var LS_COMMAND = spawn("cat", ["/etc/issue"]);
  var childProc = LS_COMMAND.childProcess;

  childProc.stdout.on('data', function (data) {
    console.log("[OS] stdout: ", data.toString());
  });
  childProc.stderr.on('data', function (data) {
    console.log("[OS] stderr: ", data.toString());
  });

  LS_COMMAND.then(function(result) {
    console.log(result.toString());
  });
}

exports.CPU = function list(event, callback) {
  var LS_COMMAND = spawn("lscpu", []);
  var childProc = LS_COMMAND.childProcess;

  childProc.stdout.on('data', function (data) {
    console.log("[OS] stdout: ", data.toString());
  });
  childProc.stderr.on('data', function (data) {
    console.log("[OS] stderr: ", data.toString());
  });

  LS_COMMAND.then(function(result) {
    console.log(result.toString());
  });
}
