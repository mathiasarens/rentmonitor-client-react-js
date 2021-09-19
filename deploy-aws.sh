#!/bin/zsh
SECONDS=0
VERSION=$(npx -c 'echo "$npm_package_version"')
echo $VERSION
echo "Deploying to AWS s3"
aws s3 sync build/ $RENTMONITOR_AWS_S3
DURATION=$SECONDS
echo "rentmonitor-client:$VERSION deployment took $(($DURATION / 60)) minutes and $(($DURATION % 60)) seconds."
