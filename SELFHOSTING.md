# MottaFit self-hosted (Coolify)

This branch packages the existing MottaFit React frontend and .NET 8 API for self-hosting with DynamoDB Local.

## Coolify
Deploy this repository as Docker Compose using `docker-compose.yml` on branch `coolify-selfhosted`.

Set one required environment variable in Coolify:

- `JWT_KEY`: a random secret of at least 32 characters (64+ recommended).

Expose the **web** service through your Coolify domain. The browser uses same-origin `/api`, which nginx proxies internally to the API.

DynamoDB Local is not exposed publicly and stores data in the named volume `dynamodb-data`. The one-shot `dynamodb-init` service creates the nine tables required by the current models.

## Notes
- This is intended first for evaluation/self-hosted testing.
- Back up the DynamoDB volume before treating this as production data.
- The current application relies heavily on DynamoDB scans; this should be revisited before large-scale production use.
- The original MIT license remains unchanged.
