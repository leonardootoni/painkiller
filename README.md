# Painkiller

If you are tired to feel pain writing authentication and authorization routines on every project that you are working on, so Painkiller can help you. It provides an authentication and authorization module out of the box the fast enable you to concentrate your efforts on your business logics.

With this project an Admin user can delegate permissions to any group on any resource (URLs) allowing those to read, save, update or delete. All routes (from the backend to the FrontEnd) are proteced as soon as the service startup and the rules are cached.

## Getting Started

git clone https://github.com/leonardootoni/painkiller

### Prerequisites

This project was written using Typescript, Express, Typeorm, React and Redis.
Moreover, the authorization rules are stored in the database and are cached during the backend startup.
The project is stable using PostgreSQL. However, considering that TypeORM has support to many other databases, there is a high probablity to all migrations work well with any database.

create a .env file using all the properties from .env-exampl




### Installing

This project requires Redis in order to work properly.
Also, before to run all the database migrations, it is necessary to install typeorm globally.



```
npm install
npm run typeorm -- migration:run
npm start
```

## Built With

* React
* Typescript
* Formik
* ExpressJs
* Typeorm
* Yup

## Contributing

Feel free to use and suggest any PR's.


## Authors

* **Leonardo Otoni**

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

