# Huddle

> **_Project Mission Statement:_**  
> Huddle tackles the problem that NYC tools like 311 isolate neighborhood issues and hide them from the community. Instead of reports disappearing into a closed system, Huddle lets residents submit issues, share local events, and see everything on an interactive neighborhood map. By making reports and events visible, searchable, and organized by location, it helps neighbors stay informed, notice patterns, and support each other, especially elders, immigrants, and offline households.

## Team

- [_Autumn Lydon_](https://www.linkedin.com/in/autumnlydon/): **Scrum Master, Full-Stack Developer**
- [_Xavier Campos_](https://www.linkedin.com/in/xavier-campos-theswe/): **Full-Stack Developer**
- [_Athena Chang_](https://www.linkedin.com/in/athena-chang/): **Full-Stack Developer**

## Project Screenshots
Home Page
<img width="1895" height="1026" alt="huddle-preview" src="https://github.com/user-attachments/assets/653fc941-a9f4-4d8c-be91-8daea28bf671" />


Login Page
<img width="1898" height="1030" alt="HUDDLE Login Page" src="https://github.com/user-attachments/assets/7fc4c935-2275-434e-9261-7af134c7c5ce" />


Sign Up Page
<img width="1919" height="1027" alt="HUDDLE Sign Up Page" src="https://github.com/user-attachments/assets/0b6f1e21-a91c-4aa2-b554-78c065facabb" />


Event Modal
<img width="1901" height="1033" alt="HUDDLE Modal Pop Up" src="https://github.com/user-attachments/assets/95e447d9-cef6-4b23-a6ed-4fac1b70e80f" />


Profile Page
<img width="1898" height="1030" alt="HUDDLE Profile Page" src="https://github.com/user-attachments/assets/52600be9-7158-4d83-afb9-6700d7eaf1f0" />



## Table of Contents

- [Getting Started](#getting-started)
  - [Build and Start Commands](#build-and-start-commands)
  - [Technologies Used](#technologies-used)
- [Project Proposal](#project-proposal)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [Style Guide](#style-guide)

## Getting Started

Before you can actually start building, you need to create a database and configure your server's environment variables to connect with it.

- Create a database with a name of your choice.
- In the `server/` folder, copy the `.env.template` and name it `.env`.
- Update the `.env` variables to match your Postgres database information (username, password, database name)
- Replace the `SESSION_SECRET` value with your own random string. This is used to encrypt the cookie's `userId` value.
  - Use a tool like [https://randomkeygen.com/](https://randomkeygen.com/) to help generate the secret.
- Your `.env` file should look something like this:

```sh
# Replace these variables with your Postgres server information
# These values are used by knexfile.js to connect to your postgres server
PG_HOST='127.0.0.1'
PG_PORT=5432
PG_USER='postgres'
PG_PASS='postgres'
PG_DB='postgres'

# Replace session secret with your own random string!
# This is used by handleCookieSessions to hash your cookie data
SESSION_SECRET='db8c3cffebb2159b46ee38ded600f437ee080f8605510ee360758f6976866e00d603d9b3399341b0cd37dfb8e599fff3'

# When you deploy your database on render, this string can be used to test SQL queries to the deployed database.
# Leave this value blank until you deploy your database.
PG_CONNECTION_STRING=''
```

### Build and Start Commands

From within the root directory, run the following commands to install dependencies and run the project locally:

```sh
# Build Command — install dependencies, build the static assets, and run migrations/seeds
cd frontend && npm i && npm run build && cd ../server && npm i && npm run migrate && npm run seed && cd ..

# Start Command
cd server && npm start
```

## Technologies Used

**Frontend:**
- React.js
- JavaScript
- CSS
- HTML

**Backend:**
- Node.js
- Express.js
- Knex.js
- PostgreSQL
- BCrypt HASH

**API:**
- Google Maps API
- reCAPTCHA
- Cloudinary

## Project Proposal

See [PROPOSAL.md](PROPOSAL.md) for more details on the project proposal.

## Roadmap

View the project roadmap [here](LINK_TO_PROJECTS_TAB).

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.

## Style Guide

This project adheres to the [Airbnb Style Guide](https://github.com/airbnb/javascript).
