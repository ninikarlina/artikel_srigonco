# PostgreSQL Setup Guide

## Instalasi PostgreSQL

### Linux (Ubuntu/Debian):
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### macOS:
```bash
brew install postgresql
brew services start postgresql
```

### Windows:
Download dari https://www.postgresql.org/download/windows/

## Setup Database

```bash
# Login ke PostgreSQL
sudo -u postgres psql

# Buat database
CREATE DATABASE artikel_srigonco;

# Buat user (opsional)
CREATE USER your_username WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE artikel_srigonco TO your_username;

# Exit
\q
```

## Update Connection String

Edit file `.env.local`:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/artikel_srigonco?schema=public"
```

Format:
```
postgresql://USERNAME:PASSWORD@HOST:PORT/DATABASE?schema=public
```

## Jalankan Migrasi

```bash
# Generate Prisma Client
npx prisma generate

# Buat migration
npx prisma migrate dev --name init

# Seed database
npm run prisma:seed
```
