# IST Challenge - Multi-Service API Quality Assurance Tool

This project is a quality assurance tool for a software product with a microservice architecture, utilizing Docker containers for API services. The APIs are written in Python, Node.js, and Java, each performing different real-world actions and connected to a shared PostgreSQL database. The solution is deployed using Docker and Bitbucket pipelines, with integrated static code analysis via SonarQube to ensure code quality and enforce a minimum test coverage threshold.

## Project URLs

- **Python API**: [https://python.ist-challenge.i-skip.com/](https://python.ist-challenge.i-skip.com/)
- **Java API**: [https://java.ist-challenge.i-skip.com/](https://java.ist-challenge.i-skip.com/)
- **Node.js API**: [https://node.ist-challenge.i-skip.com/](https://node.ist-challenge.i-skip.com/)
- **SonarQube Dashboard**: [https://test.ist-challenge.i-skip.com/](https://test.ist-challenge.i-skip.com/)

## Table of Contents
1. [Services Overview](#services-overview)
2. [Getting Started](#getting-started)
3. [Deployment](#deployment)
4. [Static Code Analysis](#static-code-analysis)
5. [Conclusion](#conclusion)


## Services Overview

1. **Python API** (`python_app/`): Provides 3 REST APIs built using Flask/Django, performing various actions.
2. **Node.js API** (`node_app/`): Contains 3 REST APIs built with Node.js and TypeScript.
3. **Java API** (`java_app/`): Implements 3 REST APIs using Java Spring Boot.
4. **Postgres Database** (`postgres/`): Stores data shared among the APIs.
5. **Tester Service** (`tester/`): Responsible for testing all APIs, written in your preferred language.

## Getting Started

To run the project locally:

1. **Clone the Repository**:
   ```bash
   git clone https://bitbucket.org/your-repo-url
   cd IST_CHALLENGE
2. Environment Variables: Ensure environment variables for each service are set in a .env file or directly in the Docker Compose files.

3. Build and Start Services:
    ```bash
    docker-compose up --build
    This command starts the services defined in the docker-compose.yml file, including the database, APIs, and tester service.

## Deployment
This project is configured for continuous integration and deployment using Bitbucket Pipelines:
1. Automatic Deployment: Pushing changes to the main branch triggers the pipeline.
2. Quality Check: The pipeline uses SonarQube to analyze code quality and test coverage. If test coverage falls below 80% or tests fail, deployment halts, and errors are logged.
3. Production Deployment:
    ```bash
    docker-compose -f docker-compose.prod.yml up --build -d
    This command deploys services in production mode.

## Static Code Analysis
The project uses SonarQube for static code analysis. SonarQube is configured to analyze code quality metrics like code smells, duplication, and maintainability. You can access the SonarQube dashboard to view real-time analysis at: [https://test.ist-challenge.i-skip.com/](SonarQube Dashboard)

## Conclusion
This project demonstrates a quality assurance tool leveraging Docker and multi-language APIs to create a robust microservice architecture. Each component is tested and monitored through SonarQube, ensuring reliable deployment standards.

