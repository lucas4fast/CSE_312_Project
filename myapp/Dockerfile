FROM node:16.9.0
# Set the home directory to /root
WORKDIR /myapp

COPY . .

RUN npm install
RUN npm install pg-promise
# Allow port 8000 to be accessed
# from outside the container
EXPOSE 8000
# Run the app
CMD npm start