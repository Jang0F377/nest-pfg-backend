# PFG-Messenger Backend REST API

#### Backend of the full stack concept app I thought of.

- Made using the Nest.JS framework.

## Technologies Used:

- Typescript
- Nest.JS
- MongoDB
- bcryptjs & jsonwebtoken

### Info:

- This is the backend for this project. It uses Nest.JS and mongoose to connect to a Mongo db.

- This is still a work in progress that I am adding to.

#### Roadmap:

- Finish Swagger/OpenAPI spec
- Implement service that will provide the date source of truth for each Sesh. Sesh date options currently include: 'today', 'tomorrow', or in date format 'MM/DD/YY' or 'MM/DD/YYYY'. The date format is easy enough to handle but if today/tomorrow are used, we need to put that into a validate-able date.
- Implement service that checks db (maybe ~10 minutes) for seshs that have occurred (date-time in the past) & move them into the user's
  seshHistory.
- Implement comments on Sesh's.
- Add service/module for adding friends
- Switch Db to Postgres
