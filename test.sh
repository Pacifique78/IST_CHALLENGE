#!/bin/bash
set -e

echo "Starting test suite..."

echo "1. Running Python tests..."
cd /app/python_app
# Add migrations or schema setup if needed
python3 -m pytest --cov=. --cov-report=xml --cov-report=term-missing -v
echo "Python tests completed!"

echo "2. Running Java tests..."
cd /app/java_app
# Run any necessary migrations
./mvnw test
echo "Java tests completed!"

echo "3. Running Node.js tests..."
cd /app/node_app
# Run migrations if needed
npm run test:migrate # (if you have such a script)
./node_modules/.bin/jest --config jest.config.ts
echo "Node.js tests completed!"

echo "Running SonarQube analysis..."
cd /app
sonar-scanner \
  -Dsonar.host.url=https://test.ist-challenge.i-skip.com \
  -Dsonar.projectKey=ist-challenge \
  -Dsonar.python.coverage.reportPaths=python_app/coverage.xml \
  -Dsonar.java.coverage.reportPaths=java_app/target/site/jacoco/jacoco.xml \
  -Dsonar.javascript.lcov.reportPaths=node_app/coverage/lcov.info \
  -Dsonar.login=$SONAR_TOKEN

echo "All tests completed!"