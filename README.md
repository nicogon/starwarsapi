# StarWars API

## Load server

commands for stating the server

    npm install
    npm run start

## Endpoints

API schema is defined in [API SPEC](apiSpec.json)

You once the server is up, you can navigate to the endpoints using the browser

[http://0.0.0.0:3000/people](http://0.0.0.0:3000/people)

[http://0.0.0.0:3000/people?sortBy=name](http://0.0.0.0:3000/people?sortBy=name)

[http://0.0.0.0:3000/people?sortBy=mass](http://0.0.0.0:3000/people?sortBy=mass)

[http://0.0.0.0:3000/people?sortBy=height](http://0.0.0.0:3000/people?sortBy=height)

[http://0.0.0.0:3000/planets](http://0.0.0.0:3000/planets)

## Architecture

- The application structure is microservices oriented. Functionality is divided into layers app/controller(included in app.js)/services/gateways

- The fetch strategy to obtain resources is parallel. It uses the first request to get the planet / people count. And with that information, we can calculate how many pages to fetch instead of using the next parameter. This approach was chosen to get a faster response time.

- Data is cached for one minute to prevent fetching data for every request

## Next steps

- Use a container to inject dependencies and improve testability
- Improve logging
- Refactor gateways there is duplicated code with the fetch strategy
- Handle errors
    - What happens if any of the request fails (4xx and 5xx errors)?
    - What happens if the requests reaches ratelimit?
    - What happens if a user is not present while populating names in planets endpoint?
    - What happens if any of the request takes forever to return data
- Improve testing, add unit & e2e tests
- Move the code to typescript
- Add a dockerfile and get the application run inside a container
- Use another approach to get large amount of data
    - backgrounds jobs to update the data
    - dispatch n requests every x amount of time
    - Use worker-queue strategy to process the requests
