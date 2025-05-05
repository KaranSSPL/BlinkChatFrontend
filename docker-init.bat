docker stop karansspl2021/blinkchatfrontend
docker rm karansspl2021/blinkchatfrontend
docker rmi karansspl2021/blinkchatfrontend
docker build -t karansspl2021/blinkchatfrontend -f .docker/Dockerfile .
docker push karansspl2021/blinkchatfrontend
docker pull karansspl2021/blinkchatfrontend
::docker run -d -p 3000:3000 --network redis-network -e CHATBOT_API_BASE_URL="http://localhost:5273" --name blinkchatfrontend karanjangid/blinkchatfrontend