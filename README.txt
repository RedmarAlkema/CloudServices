INLOGGEN/REGISTREREN
POST http://localhost:5000/auth/register
raw body
{
  "username": "test",
  "email": "t.test@gmail.com",
  "password": "test",
  "role": "admin of user"
}

POST http://localhost:5000/auth/login
raw body
{
  "username": "test",
  "password": "test",
}

MICROSERVICES:
als je inlogt krijg je een token, deze moet je meegeven bij elk request in de headers als volgt:

Authorisation		Bearer <jouw token>


TARGET MICROSERVICE
post een target met: 
POST http://localhost:3000/target/api/targets/
stuur met formdata de volgende info mee:
title TEXT
location TEXT
description TEXT
radius TEXT
deadline TEXT
image FILE


READ MICROSERVICE
haal een specifiek targets op met:
GET http://localhost:3000/read/read/<targetID>

haal alle targets op met:
GET http://localhost:3000/read/read/all
filter met bijv ?radius=10


UPLOAD MICROSERVCIE
upload een upload met
POST http://localhost:3000/upload/upload/

form data:
upload File
targetId TEXT


SCORE MICROSERVICE
get the scores from a specific target:
http://localhost:3005/score/scores/<targetId>

AUTMOTISCHE MICROSERVICE ACTIES
- na deadline van clock over is word automatisch een winnaar gegeven
- automatisch een mail nadat een gebruiker word aangemaakt
- automatisch een clock gestart na het aanmaken van een target
- target word doorgestuurd naar score, read en clock databases en microservers