# Backend

Express service for scoring, policy decisions, simulator streaming, and optional chain logging.

## Commands
```bash
npm run dev
npm run build
npm run test
```

## Endpoints
- `GET /health`
- `POST /score`
- `GET /stream` (SSE)
- `POST /scenario` with `{ "scenario": "normal|outage|critical" }`
