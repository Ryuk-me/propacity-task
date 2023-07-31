<h1 align="center"> Propacity Backend Assignment</h1>
<p align="center">
<a href="https://github.com/Ryuk-me"><img title="Author" src="https://img.shields.io/badge/Author-Ryuk--me-red.svg?style=for-the-badge&logo=github"></a>
</p>
<p align="center">
<a href="https://github.com/Ryuk-me"><img title="Followers" src="https://img.shields.io/github/followers/Ryuk-me?color=teal&style=flat-square"></a>
<a href="https://github.com/Ryuk-me/pocket-url/stargazers/"><img title="Stars" src="https://img.shields.io/github/stars/ryuk-me/pocket-url?color=brown&style=flat-square"></a>
<a href="https://github.com/Ryuk-me/pocket-url/network/members"><img title="Forks" src="https://img.shields.io/github/forks/ryuk-me/pocket-url?color=lightgrey&style=flat-square"></a>
<a href="https://github.com/Ryuk-me/pocket-url/issues"><img title="issues" src="https://img.shields.io/github/issues/Ryuk-me/pocket-url?style=flat-square">


## Database Schema

> https://dbdiagram.io/d/64c7e3c502bd1c4a5eff3af9


![Test Case Passed](./assests/db_schema.png)


> ## Installation

```sh

# Install pnpm
$ npm i -g pnpm

# Install Dependencies
$ pnpm install

> Rename .env.example to .env

# Migrate Using Prisma
$ pnpm prisma migrate dev --name init 

# Start Server
$ pnpm run start

# Access
$ http://localhost:${PORT}/health

# Using Docker
$ docker-compose build

# Start
$ docker-compose --env-file ./.env.docker up

# Access
$ http://localhost:${PORT}/health

```

## Test Api Endpoints

> Import given postman collection [v2.1] to Postman and test predefined endpoints.


#### License

MIT © [Neeraj Kumar](https://github.com/ryuk-me)