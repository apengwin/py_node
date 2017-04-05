We set up a trigger that attempts to call the included python file when a file is uploaded to a bucket.

We're able to get the code in `hello.py` to print to log when we upload `test.txt` to a storage bucket.

upload command: `gsutil cp text.txt gs://allanpeng11231994storage`

deply trigger with `gcloud beta functions deploy testName --stage-bucket allanpeng11231994 --trigger-bucket allanpeng11231994storage`

