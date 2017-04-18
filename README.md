## The code in this repo demonstrates that we can download a tarball from a gcloud storage bucket, and execute python scripts from it.

How to reproduce results.
### Uploading function

From the command line, use `gcloud beta functions deploy lightweight_tar --stage-bucket <BUCKET_NAME> <TRIGGER>`

where `<TRIGGER>` is `--trigger-bucket <STORAGE_BUCKET_NAME>`

### calling function
`touch test.txt && gsutil cp test.txt <STORAGE_BUCKET_NAME>`

You can view the logs using the command `gcloud beta functions logs read --limit 20` or if you prefer html, on the [GCF console](https://console.cloud.google.com/functions/l)

## Notes for posterity
* GCF requires all functiosn return a promise, or end with a callback. Originally, I had problems of the functions running really slowly, but when I switched from returning promises to callbacks, everything inexplicably ran faster. The lesson here is to never return a promise, which sounds kinda dark when you think about it.

* The function timeout and memory allocated return to default every time you deploy the function, and have to be reset manually.

* The overhead of IPC between the child process and the parent printing out the child's logs is pretty significant, so it's probably a bad idea to print out the output of a `tar -xcf`. Plus it spams the logs.

* GCF lets you run as root.
