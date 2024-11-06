-- Create extension first (needs to be done in postgres database)
\c postgres
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create all needed databases
CREATE DATABASE python_tododb;
CREATE DATABASE python_tododb_test;
CREATE DATABASE node_tododb;
CREATE DATABASE node_tododb_test;
CREATE DATABASE sonar;

-- Connect to python_tododb and create extensions
\c python_tododb
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Connect to python test db and create extensions
\c python_tododb_test
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Connect to node_tododb and create extensions
\c node_tododb
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Connect to node test db and create extensions
\c node_tododb_test
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Connect to sonar database and create extensions
\c sonar
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";