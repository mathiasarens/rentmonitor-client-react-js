#!/bin/zsh
SECONDS=0
VERSION=$(npx -c 'echo "$npm_package_version"')
echo $VERSION
docker build -t arm32v6/rentmonitor-client-reactjs:$VERSION .
docker save -o /tmp/rentmonitor-client-reactjs-$VERSION.img arm32v6/rentmonitor-client-reactjs:$VERSION
scp /tmp/rentmonitor-client-reactjs-$VERSION.img $DEPLOY_HOST:~/
ssh $DEPLOY_HOST "echo 'Stopping rentmonitor-client...' && docker stop rentmonitor-client && echo 'Loading rentmonitor-client...' && docker load -i rentmonitor-client-reactjs-$VERSION.img && echo 'Running rentmonitor-client...' && docker run --rm -p 80:80 --name rentmonitor-client -d arm32v6/rentmonitor-client-reactjs:$VERSION && echo Successfully deployed rentmonitor-client:$VERSION"
DURATION=$SECONDS
echo "rentmonitor-client:$VERSION deployment took $(($DURATION / 60)) minutes and $(($DURATION % 60)) seconds."
