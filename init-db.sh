#!/bin/bash
set -e

# Função para criar base + usuário
create_db() {
    local db=$1
    local user=$2
    local pass=$3

    echo "Criando banco '$db' com usuário '$user'"

    psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" -c "CREATE USER ${user} WITH PASSWORD '${pass}';"
    psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" -c "CREATE DATABASE ${db} OWNER ${user};"
    psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" -c "GRANT ALL PRIVILEGES ON DATABASE ${db} TO ${user};"
}

# Chamadas
create_db "sapl" "sapl" "sapl"
create_db "paperless" "paperless" "paperless"
