# 상권 분석 가이드

## 개요

상권 분석 기능은 등록된 모든 매장(유니온 POS + OQ)에 대해 상권 식별 및 매핑을 제공합니다. 매장 주소를 지오코딩하고, SEMAS 공인 상권에 매핑하며, 미커버 지역에는 보조 클러스터를 생성합니다.

## CLI 명령어

### 통합 매장 레지스트리

```bash
# 레지스트리 현황 확인
python apps/cli/cli.py unified-stores status

# 모든 POS 소스에서 백필
python apps/cli/cli.py unified-stores backfill --source all

# 병합 검토 대기 건 확인
python apps/cli/cli.py unified-stores review-merges
```

### 지오코딩

```bash
# 지오코딩 대상 확인
python apps/cli/cli.py geocode --dry-run

# 지오코딩 실행
python apps/cli/cli.py geocode --run

# 전체 매장 재지오코딩
python apps/cli/cli.py geocode --run --force
```

### 상권 관리

```bash
# 전체 상권 목록
python apps/cli/cli.py district list

# SEMAS 공인 상권만
python apps/cli/cli.py district list --type official

# 상권 상세 + 소속 매장
python apps/cli/cli.py district info semas_A01234

# SEMAS 데이터 갱신
python apps/cli/cli.py district refresh-semas

# 보조 클러스터 재계산
python apps/cli/cli.py district rebuild-clusters --eps 500 --min-stores 3
```

### 전체 파이프라인

```bash
# 전체 Geo ETL 파이프라인 실행
python apps/etl/etl_geo.py
```

## 환경 변수

| 변수 | 필수 | 설명 |
|------|------|------|
| `GEOCODING_PROVIDER` | 예 | `kakao` (기본값) 또는 `naver` |
| `GEOCODING_API_KEY` | 예 | Kakao REST API 키 |
| `SEMAS_API_KEY` | 예 | 공공데이터포털 서비스 키 |
| `DISTRICT_CLUSTER_EPS_M` | 아니오 | DBSCAN eps (미터, 기본값: 500) |
| `DISTRICT_CLUSTER_MIN_STORES` | 아니오 | DBSCAN 최소 매장 수 (기본값: 3) |
| `NAVER_CLIENT_ID` | 아니오 | Naver Maps API Client ID (fallback) |
| `NAVER_CLIENT_SECRET` | 아니오 | Naver Maps API Client Secret (fallback) |
| `ETL_GEO_TRIGGER` | 아니오 | `1`로 설정 시 Union/OQ sync 후 geo ETL 자동 실행 |

## API 엔드포인트

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

## 지도 시각화

```bash
cd frontend/district-map
npm install
npm run dev
# http://localhost:3000 으로 접속
```
