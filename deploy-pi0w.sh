 #!/bin/zsh

 docker build -t rentmonitor-client-reactjs:0.9.0 .
 docker save -o /tmp/rentmonitor-client-reactjs-0.9.0.img arm32v6/rentmonitor-client-reactjs:0.9.0
 scp /tmp/rentmonitor-client-reactjs-0.9.0.img pirate@pi0w:~/
 ssh pirate@pi0w "docker load -i rentmonitor-client-reactjs-0.9.0.img && docker run -it --rm -v ${PWD}:/app -v /app/node_modules -p 80:3000 -d arm32v6/rentmonitor-client-reactjs:0.9.0"