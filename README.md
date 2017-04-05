We set up a trigger that attempts to call the included python file when a file is uploaded to a bucket.

We're able to get the code in `hello.py` to print to log when we upload `test.txt` to a storage bucket.

deply trigger with `gcloud beta functions deploy testName --stage-bucket <stage_bucket_name> --trigger-bucket <upload_bucket_name>`

upload command: `gsutil cp text.txt gs://<upload_bucket_name>


TO check the output, i use the command `gcloud beta functions logs read --limit 10` and verify that the python code is printed to  log
