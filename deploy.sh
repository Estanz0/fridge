docker buildx build --platform=linux/amd64 -t docker.io/blgsmith27/fridge-server:latest --push ./backend

docker buildx build --platform=linux/amd64 -t docker.io/blgsmith27/fridge-client:latest --push ./frontend
