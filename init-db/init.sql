-- Create extension first (needs to be done in postgres database)
\c postgres
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create all databases
CREATE DATABASE python_tododb;
CREATE DATABASE python_tododb_test;
CREATE DATABASE node_tododb;
CREATE DATABASE node_tododb_test;
CREATE DATABASE java_tododb;
CREATE DATABASE java_tododb_test;

-- Set up extensions for each database
\c python_tododb
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

\c python_tododb_test
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

\c node_tododb
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

\c node_tododb_test
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

\c java_tododb
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

\c java_tododb_test
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
