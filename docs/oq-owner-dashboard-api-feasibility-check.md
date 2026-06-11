# OQ 사장님 대시보드 API 연결 가능성 체크

작성일: 2026-06-02  
목적: CTO가 API 연결을 진행하기 전에, 현재 프로토타입 화면이 API 데이터를 받을 수 있는지와 카드별 연결 가능 범위를 확인합니다.

## 결론

현재 화면은 API 연결이 가능합니다.

다만 지금 프로토타입은 정적 HTML 파일이고, 데이터는 HTML/JavaScript 안에 더미 값으로 들어가 있습니다. 따라서 CTO가 API를 붙이려면 더미 데이터 부분을 API 응답값으로 교체하면 됩니다.

즉, 화면 구조 자체는 API 연결을 막는 요소가 없습니다.

## 현재 화면에서 API 연결이 쉬운 부분

아래 카드는 첨부 문서의 district API와 연결 가능성이 높습니다.

| 화면 카드 | 연결 가능성 | 이유 |
|---|---:|---|
| 동네 동종업 중 내 순위 | 높음 | 상권 내 매장 수, 순위, 동종업 비교 데이터와 직접 연결 가능 |
| 우리 동네 경쟁 | 높음 | `/districts/{district_id}/stores`로 주변 매장 리스트를 받을 수 있을 가능성이 큼 |
| 23시 매출 약점 분석 | 중간~높음 | `/analytics`에서 시간대별 매출/동네 평균을 내려주면 연결 가능 |
| 동네 동종업 가격대 분포 | 중간 | 객단가/가격대 분포가 analytics에 있으면 가능. 메뉴 가격 데이터는 별도 확인 필요 |
| AI 어드바이스 | 중간 | `/llm/query`로 가능하나, 카드별 context 입력 구조가 필요 |

## district API만으로는 부족할 수 있는 부분

아래 카드는 district API가 아니라 POS/정산/배달앱 데이터가 필요할 가능성이 큽니다.

| 화면 카드 | 필요한 별도 데이터 |
|---|---|
| 입금 예정 · 정산 현황 | 카드사 정산, 배달앱 정산, 누락 입금, 결제일/입금 예정일 |
| 어제 메뉴 매출 TOP 5 | 메뉴별 매출, 시간대별 판매 건수, 피크 시간 |
| 채널 비중 | 홀/배달/포장 매출, 건수, 주문 출처 |
| 이번 달 일평균 매출 | POS 일별 매출, 전월 동기간 매출, 영수증 수, 객단가 |
| 내일 매출 브리핑 | 예측 모델 또는 별도 예측 API |

## 현재 HTML에서 교체해야 할 데이터 위치

현재 프로토타입의 주요 데이터는 `index.html` 내부 JavaScript에 들어 있습니다.

대표적으로 교체 대상:

- `baseHeroData`: 이번 달 일별 매출 더미
- `prevMonthData`: 전월 동기간 매출 더미
- `days`: 앞으로 7일 예측 더미
- `menus`: 메뉴 TOP 5 및 시간대별 판매량 더미
- `hours`: 시간대별 매출 분석 더미
- 정산 카드의 HTML 정적 값
- 채널 비중 카드의 HTML 정적 값
- 가격대 분포 카드의 HTML 정적 값
- AI 어드바이스 문구

CTO가 API 연결 시에는 이 값들을 직접 바꾸기보다, 아래처럼 adapter를 만드는 방식이 좋습니다.

```js
async function loadDashboardData() {
  const district = await fetchDistrictOverview();
  const analytics = await fetchDistrictAnalytics();
  return normalizeDashboardData(district, analytics);
}
```

그리고 화면은 `normalizeDashboardData()` 결과만 사용하게 만들면, API 응답 구조가 바뀌어도 화면 수정 범위를 줄일 수 있습니다.

## 화면 연결 관점에서 필요한 API 응답

현재 화면에 실제 데이터를 연결하려면 최소한 아래 형태의 데이터가 필요합니다.

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
  "settlement": {
    "today_deposit": 0,
    "weekly_confirmed_deposit": 0,
    "additional_expected_deposit": 0,
    "items": []
  },
  "forecast": {
    "tomorrow_expected_sales": 0,
    "confidence_range": 0,
    "next_7_days": []
  },
  "menu_sales": {
    "top_5": []
  },
  "ai_advice": {}
}
```

## 현재 문서 기준 확인된 API

첨부 문서에는 아래 API가 있습니다.

```text
POST /v1/districts/overview
GET  /v1/districts/{district_id}/stores
POST /v1/districts/{district_id}/analytics
POST /v1/districts/{district_id}/llm/query
```

이 API만으로 연결 가능성이 높은 화면:

- 동네 동종업 중 내 순위
- 우리 동네 경쟁
- 23시 매출 약점 분석
- 동네 동종업 가격대 분포 일부
- AI 어드바이스 일부

이 API만으로는 확인이 필요한 화면:

- 정산 현황
- 메뉴 TOP 5
- 채널 비중
- 이번 달 매출
- 내일 매출 예측

## CTO에게 전달할 핵심 체크 질문

1. `/v1/districts/overview` 응답 예시 JSON을 받을 수 있을까요?
2. `/v1/districts/{district_id}/analytics`에서 시간대별 매출과 동종업 평균을 같이 받을 수 있나요?
3. `district_id`는 현재 매장 기준으로 어떻게 찾나요?
4. 메뉴별 매출, 채널 비중, 정산 데이터는 district API에 포함되나요?
5. 포함되지 않는다면 별도 POS/정산 API가 있나요?
6. Vercel 배포 화면에서 API 호출이 가능하도록 CORS가 열려 있나요?
7. API 인증이 필요하다면 브라우저에서 직접 호출해도 되는 방식인가요, 아니면 Vercel proxy가 필요한가요?

## CTO 전달용 짧은 요약

```text
현재 프로토타입 화면은 API 연결 가능한 구조입니다.

district API 기준으로는 동네 순위, 주변 경쟁 매장, 시간대 분석, 가격대 분포 일부, AI 어드바이스는 연결 가능성이 높습니다.

다만 정산 현황, 메뉴 TOP 5, 채널 비중, 월 매출, 내일 예측은 district API만으로는 부족할 수 있어서 POS/정산/배달앱/예측 API가 별도로 필요한지 확인이 필요합니다.

현재 화면의 더미 데이터는 JS 내부 배열과 HTML 정적 값으로 들어 있어, API 응답을 normalize해서 화면 데이터로 바꾸는 adapter 방식으로 연결하면 됩니다.
```
