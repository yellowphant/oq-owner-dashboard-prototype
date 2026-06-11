# OQ 사장님 대시보드 프로토타입 핸드오프

작성일: 2026-06-02  
목적: 현재 사장님 대시보드 프로토타입을 CTO/개발팀이 검토하고, API 연결 가능성을 판단할 수 있도록 화면 구조와 데이터 요구사항을 정리합니다.

## 1. 공유 링크

- Vercel 배포 URL: https://oq-owner-dashboard-prototype.vercel.app
- GitHub repo: https://github.com/yellowphant/oq-owner-dashboard-prototype
- 로컬 원본 HTML: `/Users/wooojooon/Workspace/OQOQ/Project/owner-dashboard/index.html`
- 배포용 HTML: `/Users/wooojooon/Workspace/OQOQ/Project/owner-dashboard/index.html`

현재 Vercel 배포본은 정적 HTML 기반입니다. 숫자와 그래프 데이터는 대부분 더미 데이터이며, 일부 날짜/그래프는 브라우저 현재 날짜 기준으로 동적으로 계산됩니다.

## 2. 현재 화면 구성 순서

사장님이 보기 편한 운영 흐름 기준으로 카드 순서를 정리했습니다.

1. 이번 달 일평균 매출
2. 입금 예정 · 정산 현황
3. 내일 매출 브리핑
4. 어제 메뉴 매출 TOP 5
5. 채널 비중
6. 23시 매출 약점 분석
7. 동네 동종업 중 내 순위
8. 우리 동네 경쟁
9. 동네 동종업 가격대 분포

기획 의도는 `오늘 돈 → 내일 준비 → 어제 판매 흐름 → 채널/시간대 원인 → 동네 비교` 순서입니다.

## 3. API 연결 가능성 1차 체크

첨부 문서 기준 API는 `localhost:8000`에서 실행되는 백엔드 서버를 전제로 합니다.

문서에 있는 주요 엔드포인트:

```text
POST /v1/districts/overview
GET  /v1/districts/{district_id}/stores
POST /v1/districts/{district_id}/analytics
POST /v1/districts/{district_id}/llm/query
```

현재 문서에 없는 정보:

- 백엔드 서버 실행 명령어
- 실제 배포 API base URL
- 인증/권한 방식
- 응답 JSON 스키마
- CORS 허용 여부
- 특정 매장 식별자 또는 district_id를 어떻게 얻는지

따라서 현재 프로토타입에 API를 연결하려면 먼저 아래가 필요합니다.

1. API 서버 실행 가능 여부 확인
2. `localhost:8000/docs` 또는 OpenAPI 문서 확인
3. 각 엔드포인트 실제 응답 예시 확보
4. Vercel 배포본에서 호출 가능한 API URL 또는 Vercel proxy 구성

## 4. 카드별 데이터 요구사항

| 카드 | 필요한 데이터 | 현재 더미/동적 처리 | 연결 후보 API |
|---|---|---|---|
| 이번 달 일평균 매출 | 이번 달 일별 매출, 전월 동기간 일별 매출, 영수증 수, 객단가, 채널 비중, 결제 비중 | 브라우저 날짜 기준으로 더미 배열 slice | `/analytics` |
| 입금 예정 · 정산 현황 | 오늘 입금액, 이번 주 확정 입금, 추가 입금 예상, 정산처별 결제일/주문일, 결제액, 수수료, 입금 예정일, 누락 입금 | 정적 더미 | 별도 정산/POS API 필요 |
| 내일 매출 브리핑 | 내일 예상 매출, 신뢰구간, 최근 4주 동일 요일 평균, 앞으로 7일 예측 | 정적 더미 | 예측 API 또는 `/analytics` 확장 |
| 어제 메뉴 매출 TOP 5 | 메뉴명, 메뉴별 매출, 피크 시간, 시간대별 판매 건수 | JS 더미 배열 | POS 메뉴 판매 API 필요 |
| 채널 비중 | 홀/배달/포장 매출액, 건수, 비율, 데이터 출처 | 정적 더미 | POS + 배달앱 연동 API 필요 |
| 23시 매출 약점 분석 | 시간대별 매출, 동네 평균 대비, 직전 시간 대비 낙폭 | JS 더미 배열 | `/analytics` |
| 동네 동종업 중 내 순위 | 반경 내 동종업 매장 수, 내 순위, 일평균 매출, 객단가, 재방문율 | 정적 더미 | `/overview`, `/analytics` |
| 우리 동네 경쟁 | 주변 매장 리스트, 거리, 순위, 내 매장 위치, 경쟁 매장 위치 | 정적 더미 지도 | `/stores`, `/overview` |
| 동네 동종업 가격대 분포 | 동종업 객단가 분포, 대표 메뉴 가격, 우리 가격, 중앙값, 차이 | 정적 더미 | `/analytics`, 별도 메뉴 가격 API 필요 |
| AI 어드바이스 | 카드별 요약/추천 문장, 근거 | 정적 문구 | `/llm/query` |

## 5. API 연결 우선순위 제안

한 번에 전체 연결보다, 리스크가 낮은 순서로 연결하는 것을 추천합니다.

1. `동네 동종업 중 내 순위`
   - `/overview` 또는 `/analytics`로 연결 가능성이 높음
   - API 응답 구조 확인용 첫 테스트로 적합

2. `우리 동네 경쟁`
   - `/districts/{district_id}/stores`와 가장 직접적으로 연결됨
   - 매장 리스트, 거리, rank 구조를 확인하기 좋음

3. `23시 매출 약점 분석`
   - `/analytics`의 daily/hourly granularity 지원 여부 확인 필요

4. `동네 동종업 가격대 분포`
   - 메뉴 가격 데이터가 API에 포함되는지 확인 필요
   - 없으면 별도 API 또는 더미 유지 필요

5. `AI 어드바이스`
   - `/llm/query`로 가능하지만, 카드별 입력 context 구조가 필요
   - 운영 화면에서는 너무 자주 호출하지 않고 캐싱 권장

정산, 메뉴 TOP 5, 채널 비중은 district API만으로는 부족할 가능성이 큽니다. POS/결제/배달앱 API가 별도로 필요합니다.

## 6. 개발 연결 방식 제안

현재 HTML은 정적 파일입니다. API 연결을 고려하면 아래 방식 중 하나가 필요합니다.

### 옵션 A. 정적 HTML에서 직접 fetch

장점:
- 빠르게 테스트 가능
- 코드 변경이 적음

단점:
- API CORS 허용 필요
- 인증키를 브라우저에 노출하면 안 됨
- private/internal API에는 부적합

### 옵션 B. Vercel Serverless Function으로 proxy

장점:
- API key를 서버 환경변수로 숨길 수 있음
- CORS 문제를 줄일 수 있음
- Vercel 배포본과 연결하기 쉬움

단점:
- 단순 HTML에서 약간의 프로젝트 구조 변경 필요
- API proxy 파일 추가 필요

추천은 옵션 B입니다.

예상 구조:

```text
index.html
api/
  districts-overview.js
  district-stores.js
  district-analytics.js
```

프론트는 `/api/districts-overview`를 호출하고, Vercel function이 실제 백엔드 API를 호출합니다.

## 7. CTO에게 필요한 확인 질문

API 연결 전에 아래를 확인하면 빠르게 진행할 수 있습니다.

1. 백엔드 API 서버 실행 명령어가 무엇인가요?
2. 개발용 API base URL은 `http://localhost:8000`이 맞나요?
3. 배포용 API base URL이 있나요?
4. 인증이 필요한가요? 필요하다면 header/token 방식은 무엇인가요?
5. `district_id`는 어떻게 얻나요?
6. `/v1/districts/overview` 응답 예시 JSON을 받을 수 있을까요?
7. `/analytics`에서 시간대별 매출, 전월 동기간, 동종업 평균을 같이 받을 수 있나요?
8. 메뉴별 매출/가격/정산 데이터는 district API에 포함되나요, 별도 API인가요?
9. Vercel 배포본에서 API 호출을 허용할 CORS 설정이 가능한가요?

## 8. 현재 디자인 핸드오프 포인트

- Primary color: `#FE5A0A`
- 금액 표기: `₩` 대신 `원`
- 카드별 `AI 어드바이스` 라벨 통일
- 스크롤 진입 전 스켈레톤 표시
- 주요 숫자 count-up 애니메이션
- 그래프 hover/touch tooltip
- 모바일 대응:
  - 메뉴 TOP 5 피크 시간/건수 기본 표시
  - 정산 상세 날짜 표시
  - 7일 예측은 가로 스크롤

## 9. 다음 작업 제안

1. API 응답 예시 확보
2. 프로토타입 JS의 더미 데이터를 `mockData` 객체로 분리
3. `fetchDistrictData()` 형태의 API adapter 추가
4. API 실패 시 더미 데이터 fallback 유지
5. Vercel proxy 필요 여부 결정
6. CTO에게 API 연결 체크 리포트 전달

## 10. CTO 전달용 요약

```text
현재 사장님 대시보드 프로토타입은 Vercel에 배포되어 있고, 카드별 데이터 요구사항과 API 연결 후보를 정리했습니다.

첨부된 상권 분석 문서 기준으로는 /overview, /stores, /analytics, /llm/query 엔드포인트가 있으며, 동네 순위/경쟁/시간대 분석/AI 어드바이스 일부는 연결 가능성이 있어 보입니다.

다만 정산, 메뉴 TOP 5, 채널 비중은 POS/결제/배달앱 API가 별도로 필요할 가능성이 큽니다.

API 연결 전 확인이 필요한 것은 백엔드 실행 방법, 실제 base URL, 인증 방식, 응답 JSON, CORS 허용 여부, district_id 획득 방식입니다.
```
