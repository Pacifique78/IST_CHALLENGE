#!/bin/sh

# Wait for database to be ready
echo "Waiting for database to be ready..."
/wait-for db:5432 -t 60

# Run migrations
echo "Running database migrations..."
npm run migration:run

# Start the production application
echo "Starting the application..."
npm start