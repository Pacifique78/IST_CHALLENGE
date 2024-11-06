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

echo "Running SonarQube analysis..."
cd /app
sonar-scanner \
  -Dsonar.host.url=http://sonarqube:9000 \
  -Dsonar.projectKey=todo-application \
  -Dsonar.python.coverage.reportPaths=python_app/coverage.xml \
  -Dsonar.java.coverage.reportPaths=java_app/target/site/jacoco/jacoco.xml \
  -Dsonar.javascript.lcov.reportPaths=node_app/coverage/lcov.info \
  -Dsonar.login=$SONAR_TOKEN

echo "All tests completed!"