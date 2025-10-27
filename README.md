# heyotrip-software

# Run the project

1. In root of project run: "docker-compose up --build -d" (this starts the API and a PostgreSQL database)

2. To enter into server bash: "docker exec -it heyotrip-software-app-1 sh"

(check container name with: docker ps -a)

3. Change directory: "cd src/database"

Database tables will be created programmatically (in step 1) it is not necessary to have migrations

4. To fill database tables with data, in shell run seeders: "npx sequelize-cli db:seed:all"

# Swagger documentation and Postman

Swagger documentation is visible on address http://localhost:3000/api-docs/ I made this documentation to have description of all routs and payloads and it is show case how that is implementing. To go
deep in creation of full documentation is time consuming. Some routes requires/are gard with Auth header and require user login to use those routes.

The best way to test solution is to use Postman collection and environment from src/utils/postman folder. In those routes is included Auth header and this tool is out of the books for testing.

# Run Jest test

note: For Jest tests docker-compose will create separate database

1. Project should be in running state: "docker-compose up -d --build"

2. Install jest in root of project with command: "yarn add jest"

3. To run tests, in root of project run: "yarn run test"


