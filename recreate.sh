#!/bin/bash
set -e

# Função para recriar base + usuário
recreate_db() {
    local db=$1
    local user=$2
    local pass=$3

    echo "Recriando banco '$db' com usuário '$user'"

    # Primeiro derruba conexões ativas no banco (senão o DROP falha)
    psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" -d postgres -c \
        "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname='${db}' AND pid <> pg_backend_pid();"

    # Dropa database e usuário
    psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" -d postgres -c "DROP DATABASE IF EXISTS ${db};"
    psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" -d postgres -c "DROP USER IF EXISTS ${user};"

    # Cria novamente
    psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" -d postgres -c "CREATE USER ${user} WITH PASSWORD '${pass}';"
    psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" -d postgres -c "CREATE DATABASE ${db} OWNER ${user};"
    psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" -d postgres -c "GRANT ALL PRIVILEGES ON DATABASE ${db} TO ${user};"
}

# Chamadas
recreate_db "sapl" "sapl" "sapl"
recreate_db "paperless" "paperless" "paperless"
