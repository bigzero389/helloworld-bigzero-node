* sudo systemctl start docker
* docker build -t hello-bigzero-world .
* docker run --name bigzeroHello -p 3000:3000 -d hello-bigzero-world 
* curl localhost:3000 // result : Hello bigzero world!!!
* docker logs [containerid]
* docker ps -a
* docker stop [containerid]
* docker rm [container id] -f
* docker rmi [image id] -f
