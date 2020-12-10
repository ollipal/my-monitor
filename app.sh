#!/bin/bash

case "$1" in
run)
    deno run --allow-read --allow-net --allow-env --unstable app.js
    ;;
test)
    TESTING=1 deno test --allow-read --allow-net --allow-env --unstable
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
requirements)
    echo "Requirements met: $(grep -E "✅|❌" docs/REQUIREMENTS.md | wc -l)/$(grep " - " docs/REQUIREMENTS.md | wc -l)"
    ;;
*)
    echo $"Usage: $0 [run|test|format|lint|pre-commit|requirements]"
    ;;
esac