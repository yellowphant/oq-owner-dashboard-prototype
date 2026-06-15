# District Analysis Guide

## Overview

The district analysis feature provides commercial district identification and mapping for all registered stores (Union POS + OQ). It geocodes store addresses, maps stores to official SEMAS districts, and creates auxiliary clusters for uncovered areas.

## CLI Commands

### Unified Store Registry

```bash
# Check registry status
python apps/cli/cli.py unified-stores status

# Backfill from all POS sources
python apps/cli/cli.py unified-stores backfill --source all

# Review merge candidates
python apps/cli/cli.py unified-stores review-merges
```

### Geocoding

```bash
# Check how many stores need geocoding
python apps/cli/cli.py geocode --dry-run

# Run geocoding
python apps/cli/cli.py geocode --run

# Force re-geocode all stores
python apps/cli/cli.py geocode --run --force
```

### District Management

```bash
# List all districts
python apps/cli/cli.py district list

# List official SEMAS districts only
python apps/cli/cli.py district list --type official

# Show district details + member stores
python apps/cli/cli.py district info semas_A01234

# Refresh SEMAS data
python apps/cli/cli.py district refresh-semas

# Rebuild auxiliary clusters
python apps/cli/cli.py district rebuild-clusters --eps 500 --min-stores 3
```

### Full Pipeline

```bash
# Run complete geo ETL pipeline
python apps/etl/etl_geo.py
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GEOCODING_PROVIDER` | Yes | `kakao` (default) or `naver` |
| `GEOCODING_API_KEY` | Yes | Kakao REST API key |
| `SEMAS_API_KEY` | Yes | 공공데이터포털 service key |
| `DISTRICT_CLUSTER_EPS_M` | No | DBSCAN eps in meters (default: 500) |
| `DISTRICT_CLUSTER_MIN_STORES` | No | DBSCAN min samples (default: 3) |
| `NAVER_CLIENT_ID` | No | Naver Maps API client ID (fallback) |
| `NAVER_CLIENT_SECRET` | No | Naver Maps API client secret (fallback) |
| `ETL_GEO_TRIGGER` | No | Set to `1` to auto-trigger geo ETL after Union/OQ sync |

## API Endpoints

### POST /v1/districts/overview
```bash
curl -X POST http://localhost:8000/v1/districts/overview \
  -H "Content-Type: application/json" \
  -d '{"min_store_count": 3}'
```

### GET /v1/districts/{district_id}/stores
```bash
curl http://localhost:8000/v1/districts/semas_10028/stores \
  -H "X-User-Role: admin"
```

### POST /v1/districts/{district_id}/analytics
```bash
curl -X POST http://localhost:8000/v1/districts/semas_10028/analytics \
  -H "Content-Type: application/json" \
  -d '{"from_date": "2026-03-01", "to_date": "2026-03-25", "granularity": "daily"}'
```

### POST /v1/districts/{district_id}/llm/query
```bash
curl -X POST http://localhost:8000/v1/districts/semas_10028/llm/query \
  -H "Content-Type: application/json" \
  -d '{"question": "이 상권 매출 트렌드는?", "enable_explanation": true}'
```

## Map Visualization

```bash
cd frontend/district-map
npm install
npm run dev
# Opens http://localhost:3000
```
