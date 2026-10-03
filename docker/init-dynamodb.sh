#!/bin/sh
set -eu
export AWS_ACCESS_KEY_ID=local AWS_SECRET_ACCESS_KEY=local AWS_DEFAULT_REGION=us-east-1
endpoint="http://dynamodb:8000"

until aws dynamodb list-tables --endpoint-url "$endpoint" >/dev/null 2>&1; do
  echo "Waiting for DynamoDB Local..."
  sleep 2
done

create_table() {
  table="$1"
  if aws dynamodb describe-table --table-name "$table" --endpoint-url "$endpoint" >/dev/null 2>&1; then
    echo "$table already exists"
  else
    aws dynamodb create-table --table-name "$table" --attribute-definitions AttributeName=Id,AttributeType=S --key-schema AttributeName=Id,KeyType=HASH --billing-mode PAY_PER_REQUEST --endpoint-url "$endpoint" >/dev/null
    echo "Created $table"
  fi
}

for table in Professores Alunos Convites Exercicios Treinos Aulas Pagamentos Bioimpedancias HistoricoCargas; do
  create_table "$table"
done
