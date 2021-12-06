FROM node:16.9.0
# Set the home directory to /root
WORKDIR /myapp

COPY . .

RUN npm install

# Allow port 8000 to be accessed
# from outside the container
EXPOSE 8000
# Run the app
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.2.1/wait /wait 
RUN chmod +x /wait

CMD /wait && npm run migrate && npm start 