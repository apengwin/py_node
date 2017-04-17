/*Bacckground Cloud Function to be triggered by Cloud Storage.
 *
 * @param {object} event The Cloud Functions event.
 * @param {function} The callback function.
 */
const spawn = require('child-process-promise').spawn;

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
  var promise = spawn("echo $UID");
  var childProcess = promise.childProcess;
  childProcess.stdout.on('data', function (data) {
    console.log('[spawn] stdout: ', data.toString());
  });
  childProcess.stderr.on('data', function (data) {
    console.log('[spawn] stderr: ', data.toString());
  });


    promise.then(function(result) {
        console.log(result.stdout.toString())
    })
    .catch(function(err) {
        console.error(err.stderr);
    }); 
  callback();
}

