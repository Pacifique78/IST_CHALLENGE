#!/bin/bash
set -e

echo "Starting test suite..."

echo "1. Running Python tests..."
cd /app/python_app
python3 -m pytest --cov=. --cov-report=xml --cov-report=term-missing -v
echo "Python tests completed!"

# echo "2. Running Java tests..."
# cd /app/java_app
# ./mvnw test
# echo "Java tests completed!"

# echo "3. Running Node.js tests..."
# cd /app/node_app
# ./node_modules/.bin/jest --config jest.config.ts
# echo "Node.js tests completed!"

echo "All tests completed!"