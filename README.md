# Prisma Blog Application Work Sample

## Description

A small web application for interacting with blogs and posts.

## Introduction

Hello and thank you for reviewing my code! 😊

In this small repo you will find my submission for the coding challenge.
I have attempted to fulfill all the functional requirements and data descriptions present in the assignment document.

This app has some cool features to be aware of:
- Full dependancy injection with class-based controllers and services
- Global request logging including error response logging (just to console for now)
- Complete pre-controller parameter validation
- UUIDs on all objects and used for all client input/output
- Linting and formatting policy defined and enforced
- Customizable application globals using environment variables (I will include dev and test env files for your convenience)
- Exhaustive OpenAPI documentation (see below for more info about the docs)

I also implemented exhaustive e2e tests for one of the endpoints (blog creation). To run these, please see the 'Test' section below.

Thanks again and please don't hesitate to reach out if there are any questions or concerns.

## Reviewer Questions

> What were some of the reasons you chose the technology stack that you did?

For my framework, I chose NestJs. I really like Nest due to its simplicity, structured approach and the tools that one gets out of or nearly out of the box.
With Nest, I find I can get something up and running very quickly. Furthermore, standard and tested aspects of good app construction are easy to implement.
For instance, parameter validation or dependancy injection. The documentation is very accessible and complete and the community is large. Lastly, I really
like the 'Nest' way of structuring a project. I think it keeps things clean, enforces proper domain boundaries and makes extending projects easy, even in
the context of additional developers and teams.

For my data layer I chose MongoDB. I had several reasons for this. Firstly, it is very easy to get up and running quickly with little to no configuration.
Perfect for a small example project. Furthermore, with a project that is just beginning and may continue into the future, the data model is probably not known
and subject to big changes. Mongo also deals with this very well compared to a relational DB which would require more overhead there (eg. migrations). Lastly,
I thought about my users, the data and how data consumtion would work. Here we have an app with a heavy read bias of large textual globs of data. This is
the bread and butter use case for a non-relational DB and I think something like Mongo deals with this very well and in a very performant way.

> What were some of the trade-offs you made when building this application? Why were these acceptable trade-offs?

The use of Mongo for the data layer did have a trade-off associated with it. Namely, the use of transactions which, although supported, required some extra 
configuration. For this functionality, mongo requires a replica set to be defined on the DB being connect to. This required a bit more effort in containerizing
the DB. I felt it was worth the extra time given the benefits I talked about above.

> Given more time, what improvements or optimizations would you want to add?

Some possible immediate next steps for the project:
- Implement full suite of unit tests and finish all e2e/integration tests
- Containerize the application fully
- Implement additional blog/post functionality (eg. bulk-create, updating and deletion, reviews, analytics)
- Implement additional platform functionality (eg. authentication, roles)
- Abstract the database interaction layer into its own service

> What would you need to do to make this application scale to hundreds of thousands of users?

This application is still very small and fast. However, with heavy heavy usage, it would still require a couple prudent things to be done.
Firstly, I would add an index in the DB for the uuids and slugs of the blogs (or any other often-used identifiers which were introduced). This is important seeing
as the application is so read-heavy. A blog/post may be created once and read thousands or millions of times. This means that we would really need to make sure fetching
data is done in a performant way. Secondly, in the same vein, we would want to dedicate considerable resources to our DB deployment. This means having a large
cluser of replica sets which we optimized for reading. MongoDB supports read replicas which is something we would probably want to use. These are DB instances
dedicated to simply reading data. This combined perhaps with sharding, splitting your data across multiple instances to normalize the load, would help to also
keep us performant.

Additionally, caching would also be a good thing to implement for such scale. I think it would also work very well of this application given that query similarity
is extremely high. This would mean we could potentially achieve high hit/miss ratios. For this, we could either use WiredTiger, another MongoDB product or something
like redis. NestJs also provides us with an easy way of configuring application/request caching which we can manualy manage. A last cache we could poentially take
advantage of would be by switching to GraphQL. NestJs supports easy implementation of GraphQL and this could potentially cut down server response times considerably.

Lastly, We would want to take a look at how we were deploying our app. The use of enough deployment resources, dynamic scaling to account for peak load times and
also a load balancer / proxies could help us deal with a high number of users by ensuring optimal distribution of requests so that our servers do not get overwhelmed.

> How would you change the architecture to allow for models that are stored in different databases?

Luckily, our framework provides a standard and simple approach for supporting multiple databases for different collections / models. In our base module, we can import
and connect to multiple databases with different connection URIs. Then in our sub-modules, we import only the DB(s) we want to interact with. This way, we stay
organized and readable.

> How would you deploy the Architecture you designed in a production ready way?

Firstly, I would decide on a deployment platform for the application (eg. AWS, Heroku, GCP). When setting up this deployment I would ensure that dynamic scaling was
implemented with a high dyno cap to account of peak load. Load balancing would also be required and so the use of what ever the solution for our deployment environment
provided would have to be used (eg. ELB for AWS). For the DB, I would probably use Mongo Atlas. Here we can define an API key for access to our DB and add
it to our app deployment (eg. in AWS secrets manager). Making sure the DB deployment was using a cluster would also be important for fault-tolerance and performance.

> BONUS: How would you go about swapping out the database for a different one?

Swapping out databases will always involve some code changes and reconfiguration. Especially if the fundamental type of DB was being changed (SQL --> NOSQL).

The first step I would take in any case would be to refactor my ORM to TypeOrm or another with a broader support for different DBs. This would ensure that
the way we define and connect to our DB would remain almost constant desipe a change. Additionally, it would standardize our model definitions as much as
possible and ensure minimal reconfiguration. Then I would abstract the data layer into its own service and, thus, centralize all DB access meaning there
would only be one place to update DB access methods if necessary.

Then we come to our two possible cases. For the easy one, it would be simply switching DBs but within the same paradigm (i.e. keeping it SQL or NOSQL).
This would mean that our models and data structure could remain essentially the same and only the connection and some configuration would have to be updated.
This would mean swapping connection strings and ensuring that our model definitions still worked which they should. Finally we would change which DB was
loaded into our app module for use with the ORM on startup.

The more difficult case is the second, namely going from SQL to NOSQL or visa-versa. Here we would most likely have to refactor our models slightly especially
when it comes to relationships. This would probably not be totally bad though since if we are switching DB paradigms it would be prudent to rethink how we
are interacting with our data and which joins, aggregations, nesting strategies etc we are using. As a last note here, using UUIDs as primary resource identifiers
(which this project already does) can help during a DB change since the method of resource interaction would remain constant. If the datatype or structure
of our resource identifiers were to also change, this would just be another potential source of problems.

The final consideration is how we would handle the change in our deployment architecture. This would also require reconfiguration, however, taking the
above steps would ensure minimal effort in switching DBs when it came to the project code. 

## Dependancies

- Docker
- Node > 18

## Installation

```bash
$ npm install
```

## Starting the database

```bash
# start the DB
$ npm run start-db

# stop the DB
$ npm run stop-db
```

## Running the app
`(!) Don't forget to start the DB before running the app.`

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test
`(!) If running E2E tests, don't forget to start the DB before hand.`

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Documentation

When you run the app in `dev` mode, the documentation is automatically generated and served at `http://localhost:<PORT>/api`.
Simply navigate to this URL in your browser to view the API documentation.

## License

This project is UNLICENSED.

Author: Dahv Reinhart
