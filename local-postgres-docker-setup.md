# Running postgres locally in docker container

```
docker run -d \
    -e POSTGRES_PASSWORD=postgres \
    -e POSTGRES_USER=postgres \
    -e POSTGRES_DB=postgres-db \
    --name postgres-db \
    -p 5432:5432 \
    postgres
```

(these are just example values, put the chosen values to `config/.env`)

## Connect to db:

To connect
`docker exec -it postgres-db psql -U postgres postgres-db`

(or from local: `psql postgres-db -h localhost -U postgres`)

To exit:
`\q`
