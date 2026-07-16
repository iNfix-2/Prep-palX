# Local Development

## Setup

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Validation

```bash
npx tsc --noEmit
npm run lint
npm test
npm run build
```

## Current Limitations

- No real database.
- No production authentication.
- The first `/api/v1` class slice is integrated with in-memory seed data.
- Older `/api/*` prototype routes still return mock data.
