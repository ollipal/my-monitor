# create application and add database

When in the Heroku dashboard (https://dashboard.heroku.com/apps), we click on the "New" button and select
"Create new app" to start creating an application, called for example `my-m0nit0r`. Select region and click 'create'.

When the application has been created, we need to add the correct buildpack that provides Heroku the functionality
needed to build the application. When in the details window of the application, click on the Settings tab.
When in the Settings tab, add a buildpack. For Deno, we use the buildpack at https://github.com/chibat/heroku-buildpack-deno.git.

Once the build pack has been added, we next add an add on to the project. Go to the Resources tab and search for
"Heroku Postgres" from the Add-ons. This opens up a dialog that asks whether we want to add the Heroku Postgres
to our project. Choose the plan name "Hobby Dev - Free" and click Submit Order Form. Now, we should see
Heroku Postgres added as an add-on to the project. After a while, you can click on the Heroku Postgres database
and check its current status.

# creating the tables

When we click on the database, we are shown a status and an overview of the database. The address where this is
shown should start with something like https://data.heroku.com. When you click the Settings tab, you are shown
a few options. Click the View Credentials -button to see the credentials for the database that you are currently using.

Copy the Heroku CLI command, which is the command that we can use with Heroku CLI to access the database on
command line. The command is something like 'heroku pg:psql ${database_name} --app ${application_name}'
, where the database name and the application name are specific to your application.

If you see an error stating that the local psql command could not be found, you need to install psql
locally (psql is the interactive postgresql terminal that comes with postgresql). In Linux, this can be done as follows.

`$ sudo apt-get install postgresql`

When we run the command using command line, we connect to the database. In the following example, we first check
for the tables in the database using the command \dt, after which (as there are no tables) we create a table called names.
This is followed by another check of the tables in the database.

```
$ heroku pg:psql ${database_name} --app ${application_name}

// ...

${application_name}::DATABASE=> \dt
Did not find any relations.

// run the SETUP.sql commands

${application_name}::DATABASE=> \dt
                 List of relations
 Schema |      Name       | Type  |     Owner
--------+-----------------+-------+----------------
 public | evening_reports | table | (owner)
 public | morning_reports | table | (owner)
 public | users           | table | (owner)
 (3 rows)

// ...

${application_name}::DATABASE=> \q

```

# create Procfile

(see the Procfile)

# deploy application

```
heroku git:remote -a my-m0nit0r
git push heroku master
```

(otherwise normal git workflow)

## logs

- `heroku logs` (all logs)
- `heroku logs --app=my-m0nit0r --tail` (only spesifc app, running)
- `heroku logs --app=my-m0nit0r --tail --source=app` (smae as previous, but without heroku logs)
