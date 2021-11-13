* sudo systemctl start docker
* docker build -t helloBigzeroWorld .
* docker run -p 3000:3000 -d helloBigzeroWorld 
* curl localhost:3000 // result : Hello bigzero world!!!
* docker logs [containerid]
* docker ps
* docker stop [containerid]
* docker rmi [imageid] -f
