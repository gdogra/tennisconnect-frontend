#!/bin/bash

# ✅ Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL at $DB_HOST:$DB_PORT..."
/usr/local/bin/wait-for-it "$DB_HOST:$DB_PORT" --timeout=60 --strict -- echo "✅ Database is ready!"

# ✅ Run the seed script
echo "🌱 Running seed script..."
node reset-and-seed.js

# ✅ Start the server
echo "🚀 Starting the server..."
exec node server.js

