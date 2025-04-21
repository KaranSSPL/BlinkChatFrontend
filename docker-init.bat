docker stop ssplrahul/blinkchatfrontend
docker rm ssplrahul/blinkchatfrontend
docker rmi ssplrahul/blinkchatfrontend
docker build -t ssplrahul/blinkchatfrontend -f .docker/Dockerfile .
docker push ssplrahul/blinkchatfrontend
docker pull ssplrahul/blinkchatfrontend
docker run -d -p 3000:3000 ssplrahul/blinkchatfrontend
