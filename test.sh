#!/bin/bash
set -e

echo "Starting test suite..."

echo "Running Python tests..."
cd /app/python_app
python3 -m pytest --cov=. --cov-report=xml --cov-report=term-missing -v

echo "Running Node.js tests..."
cd /app/node_app
./node_modules/.bin/jest --config jest.config.ts

echo "Running SonarQube analysis..."
cd /app
sonar-scanner \
  -Dsonar.host.url=http://sonarqube:9000 \
  -Dsonar.projectKey=todo-application \
  -Dsonar.python.coverage.reportPaths=test-results/python-coverage.xml \
  -Dsonar.javascript.lcov.reportPaths=test-results/node-coverage/lcov.info \
  -Dsonar.login=$SONAR_TOKEN

echo "All tests completed!"