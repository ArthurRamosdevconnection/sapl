#!/bin/bash
set -e

# Função para criar base + usuário
create_db() {
    local db=$1
    local user=$2
    local pass=$3

    echo "Criando banco '$db' com usuário '$user'"

    psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
        CREATE USER $user WITH PASSWORD '$pass';
        CREATE DATABASE $db OWNER $user;
        GRANT ALL PRIVILEGES ON DATABASE $db TO $user;
EOSQL
}

# Chamadas
create_db "sapl" "sapl" "sapl"
create_db "paperless" "paperless" "paperless"
