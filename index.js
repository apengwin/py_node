/*Bacckground Cloud Function to be triggered by Cloud Storage.
 *
 * @param {object} event The Cloud Functions event.
 * @param {function} The callback function.
 */

var PythonShell = require("python-shell");

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
            console.log("finished");
        });
        console.log("hello");
    }

  callback();
};
