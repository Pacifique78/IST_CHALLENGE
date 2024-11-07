#!/bin/bash
set -e

echo "Starting test suite..."

echo "1. Running Python tests..."
cd /app/python_app
# Add migrations or schema setup if needed
python3 -m pytest --cov=. --cov-report=xml --cov-report=term-missing -v
echo "Python tests completed!"

# echo "2. Running Java tests..."
# cd /app/java_app
# # Run any necessary migrations
# ./mvnw test
# echo "Java tests completed!"

# echo "3. Running Node.js tests..."
# cd /app/node_app
# # Run migrations if needed
# npm run test:migrate # (if you have such a script)
# ./node_modules/.bin/jest --config jest.config.ts
# echo "Node.js tests completed!"

echo "Running SonarQube analysis..."
cd /app
sonar-scanner \
  -Dsonar.host.url=https://test.ist-challenge.i-skip.com \
  -Dsonar.projectKey=ist-challenge \
  -Dsonar.python.coverage.reportPaths=python_app/coverage.xml \
  -Dsonar.login=$SONAR_TOKEN \
  -Dsonar.exclusions=**/*.java,**/*.ts,**/*.js,**/*.jsx,**/*.tsx \
  -Dsonar.sources=python_app/app.py,python_app/extensions.py,python_app/models.py,python_app/routes/**/*.py \
  -Dsonar.tests=python_app/tests/**/*.py \
  -Dsonar.test.inclusions=**/*test*.py,**/conftest.py \
  -Dsonar.python.version=3 \
  -Dsonar.sourceEncoding=UTF-8

echo "All tests completed!"