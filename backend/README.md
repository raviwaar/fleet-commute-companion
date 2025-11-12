🚗 Fleet Commute Companion Backend API

🌟 Project Overview

This repository contains the robust backend API for the Fleet Commute Companion application. Built on Django and Django REST Framework, this service manages all core data and business logic related to fleet management, user ride-sharing/matching, route optimization, and schedule management.

The API is responsible for ensuring efficient, secure, and reliable communication between the client applications (web/mobile) and the database.

✨ Core Backend Responsibilities

This Django backend provides RESTful endpoints and services for:

User & Authentication: Managing user accounts, roles, and securing access via token-based authentication (e.g., JWT).

Fleet Management: CRUD operations for vehicles, drivers, and associated metadata.

Route & Geo Data: Storing and querying vehicle routes, defining authorized geo-zones, and handling geographical data (requires PostGIS integration for production environments).

Commute Scheduling: Managing scheduled commutes, matching riders to available fleet vehicles, and handling ride requests.

Admin Tools: Access to the Django Admin interface for operational data management and auditing.

🛠️ Prerequisites

Ensure you have the following installed before setting up the project:

Python 3.10+

pip (Python package installer)

virtualenv (Recommended)

PostgreSQL (Recommended for its support of advanced geographic queries, though SQLite can be used for simple local testing).

🚀 Setup and Installation

Follow these steps to get the development environment up and running.


1. Clone the repository
```bash

git clone <repo>
cd fleet-commute-companion/backend
```

2. Create and activate a virtual environment

It's highly recommended to use a virtual environment to manage dependencies.
```bash

# Create the environment
python3 -m venv fleet

# Activate the environment (Linux/macOS)
source fleet/bin/activate

# Activate the environment (Windows)
.\fleet\Scripts\activate
```

3. Install dependencies

Install all required Python packages using pip:
```bash
pip install -r requirements.txt
```

4. Configure Environment Variables

Create a file named .env in the project's root directory. This file will store your configuration secrets.
```bash
# Example .env content
SECRET_KEY=your_insecure_secret_key_for_dev
DEBUG=True

# Database Settings (PostgreSQL Example)
POSTGRES_DB=fleet_mvp_db
POSTGRES_USER=fleet_user
POSTGRES_PASSWORD=fleet_password
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
```

5. Apply Migrations

Migrate the database to create the necessary tables:
```bash
python manage.py migrate
```

6. Create a Superuser (Optional but Recommended)

Create an admin account to access the Django Admin interface:
```bash
python manage.py createsuperuser
```

🏃 Running the Application

Start the development server:

```bash
python manage.py runserver
```

The API will now be accessible at: http://127.0.0.1:8000/graphql

Django Admin: http://127.0.0.1:8000/admin/
Use Admin Portal using superuser credentials to create Organisations and assigning org admin along with Organisation Memberships.

