# OQ 사장님 대시보드 API/디자인 핸드오프 문서

작성일: 2026-06-02  
대상: CTO  
목적: CTO님이 API 연결을 진행하실 때 참고할 수 있도록, 현재 구현된 화면 구조와 데이터 연결 지점, 디자인 핸드오프 정보를 전달합니다.

## 1. 현재 프로토타입 링크

- Vercel 배포 URL: https://oq-owner-dashboard-prototype.vercel.app
- GitHub repo: https://github.com/yellowphant/oq-owner-dashboard-prototype
- 전달 HTML 파일: `index.html`

현재 배포본은 정적 HTML 기반 프로토타입입니다. 실제 API 연결은 CTO님이 진행하실 예정이며, 화면에는 현재 더미 데이터가 들어가 있습니다.

## 2. 결론: API 연결 가능 여부

현재 HTML 화면은 API 연결 가능한 구조입니다.

다만 첨부된 `district_analysis_guide.md` 기준의 district API만으로 모든 카드를 연결할 수 있는 것은 아닙니다. 상권/동종업/경쟁 매장/시간대 분석 쪽은 연결 가능성이 높고, 정산/메뉴/채널/예측 데이터는 별도 POS, 결제, 배달앱, 예측 API가 필요할 가능성이 큽니다.

## 3. 첨부 문서 기준 API

`district_analysis_guide.md`에 확인된 API는 아래와 같습니다.

```text
POST /v1/districts/overview
GET  /v1/districts/{district_id}/stores
POST /v1/districts/{district_id}/analytics
POST /v1/districts/{district_id}/llm/query
```

문서상 API base URL은 `http://localhost:8000` 기준입니다.

현재 문서에는 아래 정보가 없습니다.

- 백엔드 서버 실행 방법
- 실제 배포 API base URL
- API 응답 JSON 예시
- 인증 방식
- CORS 허용 여부
- 현재 매장 기준 `district_id`를 얻는 방법

## 4. district API로 연결 가능성이 높은 화면

| 화면 카드 | 연결 가능성 | 연결 후보 API | 비고 |
|---|---:|---|---|
| 동네 동종업 중 내 순위 | 높음 | `/overview`, `/analytics` | 동종업 매장 수, 순위, 평균 매출, 객단가 등 |
| 우리 동네 경쟁 | 높음 | `/districts/{district_id}/stores` | 주변 매장 리스트, 거리, 순위 |
| 23시 매출 약점 분석 | 중간~높음 | `/analytics` | 시간대별 매출, 동네 평균 비교 필요 |
| 동네 동종업 가격대 분포 | 중간 | `/analytics` | 객단가 분포 가능성 있음. 메뉴 가격 비교는 별도 확인 필요 |
| AI 어드바이스 | 중간 | `/llm/query` | 카드별 context를 넘기는 방식 필요 |

## 5. district API만으로 부족할 수 있는 화면

| 화면 카드 | 필요한 추가 데이터 |
|---|---|
| 입금 예정 · 정산 현황 | 카드사 정산, 배달앱 정산, 입금 예정일, 누락 입금, 결제일/주문일 |
| 어제 메뉴 매출 TOP 5 | 메뉴별 매출, 메뉴별 시간대 판매 건수, 피크 시간 |
| 채널 비중 | 홀/배달/포장 매출액, 건수, 주문 출처 |
| 이번 달 일평균 매출 | POS 일별 매출, 전월 동기간 매출, 영수증 수, 객단가 |
| 내일 매출 브리핑 | 예측 모델 또는 별도 예측 API |

정산, 메뉴, 채널, 월 매출, 예측은 district API 외에 POS/정산/배달앱/예측 API가 필요한지 확인이 필요합니다.

## 6. 현재 HTML 내 더미 데이터 위치

현재 주요 더미 데이터는 `index.html` 내부 JavaScript와 일부 HTML 정적 값에 들어 있습니다.

API 응답으로 교체 가능한 주요 위치:

```js
baseHeroData   // 이번 달 일별 매출
prevMonthData  // 전월 동기간 일별 매출
days           // 앞으로 7일 예측
hours          // 시간대별 매출 분석
menus          // 메뉴 TOP 5 및 시간대별 판매량
```

HTML 정적 값으로 들어간 영역:

- 정산 현황 상단 금액
- 정산처별 결제일/주문일, 결제액, 수수료, 입금 예정액
- 채널 비중 금액/건수
- 동네 순위 상세 지표
- 주변 경쟁 매장 리스트
- 가격대 분포와 대표 메뉴 가격 비교
- AI 어드바이스 문구

## 7. API 연결 시 참고할 화면 구조

현재 화면은 정적 HTML이지만, 더미 데이터가 들어간 영역을 API 응답값으로 교체할 수 있는 구조입니다.  
CTO님이 연결하실 때는 화면 곳곳의 값을 직접 바꾸기보다, API 응답을 화면용 데이터 형태로 변환한 뒤 렌더링하는 방식이 안정적입니다.

예시:

```js
async function loadDashboardData() {
  const districtOverview = await fetchDistrictOverview();
  const districtAnalytics = await fetchDistrictAnalytics();
  const stores = await fetchDistrictStores();

  return normalizeDashboardData({
    districtOverview,
    districtAnalytics,
    stores
  });
}
```

화면이 `normalizeDashboardData()` 결과만 사용하도록 바뀌면, API 응답 구조가 일부 변경되어도 화면 수정 범위를 줄일 수 있습니다.

Vercel 배포본에서 API를 호출할 경우에는 CTO님이 아래 방식 중 하나를 선택하시면 됩니다.

### 옵션 A. 브라우저에서 API 직접 호출

필요 조건:

- API가 외부에서 접근 가능해야 함
- CORS 허용 필요
- 브라우저에 노출돼도 되는 인증 방식이어야 함

### 옵션 B. Vercel Serverless Function으로 proxy

인증키가 있거나 CORS 이슈가 있을 경우 더 적합한 방식입니다.

장점:

- API key를 브라우저에 노출하지 않음
- CORS 문제를 줄일 수 있음
- Vercel 배포본과 연결하기 쉬움

예상 구조:

```text
index.html
api/
  districts-overview.js
  district-stores.js
  district-analytics.js
  ai-advice.js
```

## 8. 디자인 연결용 핸드오프

### 화면 순서

현재 카드 순서는 사장님 운영 흐름 기준으로 정리되어 있습니다.

1. 이번 달 일평균 매출
2. 입금 예정 · 정산 현황
3. 내일 매출 브리핑
4. 어제 메뉴 매출 TOP 5
5. 채널 비중
6. 23시 매출 약점 분석
7. 동네 동종업 중 내 순위
8. 우리 동네 경쟁
9. 동네 동종업 가격대 분포

흐름 의도:

```text
오늘 돈 → 내일 준비 → 어제 판매 흐름 → 채널/시간대 원인 → 동네 비교
```

### 주요 UX/디자인 포인트

- Primary color: `#FE5A0A`
- 금액 표기: `₩` 대신 `원`
- 카드별 `AI 어드바이스` 라벨 통일
- 스크롤 진입 전 스켈레톤 표시
- 주요 숫자 count-up 애니메이션
- 그래프 hover/touch tooltip
- 전월 동기간 비교 토글 버튼
- 모바일에서 메뉴 TOP 5 피크 시간/건수 기본 표시
- 정산 상세에 결제일/주문일 표시
- 7일 예측은 금액 우선 표시, 모바일 가로 스크롤

### 디자인 연결 시 유의점

- 카드 컴포넌트는 대부분 동일한 패턴을 사용합니다.
  - `card-head`
  - `card-sub`
  - 본문 데이터 영역
  - `ai-suggest`
- API 연결 시에도 카드 구조는 유지하고, 내부 데이터만 교체하는 방식이 좋습니다.
- 모바일에서는 일부 표 형태가 카드형으로 바뀌므로, 데이터 필드가 빠지지 않게 주의해야 합니다.
- 스켈레톤과 count-up 애니메이션은 데이터 로딩 UX로 유지할 수 있습니다.

## 9. API 연결 시 화면이 기대하는 데이터 필드

아래는 현재 화면에 데이터를 연결할 때 필요한 최소 데이터 형태입니다. 실제 API 응답이 이 구조와 달라도, 중간 변환 단계에서 아래 형태로 맞춰주면 화면 연결이 쉬워집니다.

```json
{
  "monthly_sales": {
    "current_month_daily": [],
    "previous_month_same_period_daily": [],
    "receipt_count": 0,
    "average_ticket": 0,
    "channel_ratio": {
      "hall": 0,
      "delivery": 0,
      "takeout": 0
    }
  },
  "settlement": {
    "today_deposit": 0,
    "weekly_confirmed_deposit": 0,
    "additional_expected_deposit": 0,
    "items": []
  },
  "forecast": {
    "tomorrow_expected_sales": 0,
    "confidence_range": 0,
    "weekday_average": 0,
    "next_7_days": []
  },
  "menu_sales": {
    "top_5": []
  },
  "district": {
    "district_id": "",
    "store_count": 0,
    "my_rank": 0,
    "nearby_stores": []
  },
  "analytics": {
    "hourly_sales": [],
    "district_hourly_average": [],
    "price_distribution": {},
    "menu_price_comparison": []
  },
  "ai_advice": {
    "monthly_sales": "",
    "settlement": "",
    "forecast": "",
    "menu": "",
    "channel": "",
    "hourly_weakness": "",
    "rank": "",
    "competition": "",
    "price": ""
  }
}
```

## 10. CTO 전달용 요약

```text
현재 구현한 사장님 대시보드 화면은 API 연결 가능한 구조입니다.

district API 기준으로는 동네 순위, 주변 경쟁 매장, 시간대 분석, 가격대 분포 일부, AI 어드바이스는 연결 가능성이 높습니다.

다만 정산 현황, 메뉴 TOP 5, 채널 비중, 월 매출, 내일 예측은 district API만으로는 부족할 수 있어 POS/정산/배달앱/예측 API가 별도로 필요한지 확인이 필요합니다.

API 연결은 CTO님이 진행하실 예정이므로, 이 문서에는 화면에서 교체해야 할 더미 데이터 위치와 필요한 데이터 필드, 디자인 연결을 위한 카드 순서/컴포넌트 구조/모바일 처리 방식을 정리했습니다.
```
