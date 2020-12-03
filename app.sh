#!/bin/bash

case "$1" in
run)
    deno run --allow-read --allow-net app.js
    ;;
test)
    deno test
    ;;
format)
    deno fmt
    ;;
lint)
    deno lint --unstable --json
    ;;
pre-commit)
    echo "testing:" && ./app.sh test
    echo "formatting:" && ./app.sh format
    echo "linting:" && ./app.sh lint
    ;;
*)
    echo $"Usage: $0 [run|test|format|lint|pre-commit]"
    ;;
esac