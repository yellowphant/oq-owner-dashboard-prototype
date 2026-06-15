# OQ 사장님 대시보드 — 타이포그래피 체계

현재 `index.html`에 적용된 폰트 스타일 체계를 정리한 문서입니다. (분석 기준: 2026-06-15)

> **2026-06-15 조정 반영**: 전체 폰트 굵기를 기존에서 **100씩 낮추고**(800→700 … 500→400), 자간(letter-spacing)을 **-3%(`-0.03em`)** 로 전역 적용했습니다.

## 1. 폰트 패밀리

```css
font-family: "Pretendard Variable", Pretendard, -apple-system, sans-serif;
```

- **Pretendard** (v1.3.9) — CDN으로 로드
  ```html
  <link rel="stylesheet"
    href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css">
  ```
- Variable 폰트 우선, 미지원 환경은 static Pretendard → 시스템 폰트(`-apple-system`) 순으로 폴백
- 모든 버튼·입력 요소는 `font-family: inherit`로 본문 폰트를 그대로 상속 (브라우저 기본 폼 폰트 방지)
- 렌더링 품질: `-webkit-font-smoothing: antialiased`

## 2. 기본값 (body)

| 속성 | 값 |
|---|---|
| 색상 | `var(--ink)` = `#101010` |
| line-height | `1.5` |
| letter-spacing | `-0.03em` (-3% — 전역 적용, 상속) |
| font-smoothing | antialiased |

> 본문 base font-size는 별도 지정이 없어 브라우저 기본(16px)이며, 실제 텍스트는 대부분 컴포넌트에서 px로 재지정됩니다.

## 3. 타입 스케일 (역할별)

폰트 크기는 의미 단위로 묶여 있습니다. 굵기는 거의 항상 **700(제목·수치) / 600(강조·라벨) / 500(중간 본문) / 400(일반 본문)** 4단계만 사용합니다.

### Display · 핵심 수치 (Metric)
| px | weight | 용도 | 예시 클래스 |
|---|---|---|---|
| 38 | 700 | 최상위 KPI (이번 달 일평균 매출) | `.hero .big` |
| 32 | 700 | 순위 큰 숫자 | `.peer-rank-big .num` |
| 30 | 700 | 경쟁 순위 숫자 | `.comp-rank-big .num` |
| 28 | 700 | 예측·가격 메인 수치 | `.fc .big`, `.price-main .num` |
| 22 | 700 | 집계 보조 수치 | `.hsrc .v` |
| 21 | 700 | 정산 박스 금액 / 분석 헤드라인 | `.stl-box .v`, `.ai-headline` |
| 20 | 700 | peer 지표 값 / 평판 점수 | `.pm .v`, `.rep-score .num` |
| 18 | 700 | 요일 비교 값 | `.weekday-box .v` |

### Heading · 제목
| px | weight | 용도 | 예시 클래스 |
|---|---|---|---|
| 17 | 700 | 헤더 서비스 타이틀 | `.head-txt h1` |
| 15 | 700 | 카드 제목 | `.card-title` |
| 14 | 600~700 | 근거 항목 강조 / 빈 상태 제목 | `.ev-txt strong`, `.empty-title` |

### Body · 본문
| px | weight | 용도 | 예시 |
|---|---|---|---|
| 14 | 400 | 분석 결론 문장 | `.ai-conclusion` |
| 13.5 | 400 | hero 보조 설명 | `.hero .sub` |
| 13 | 400 | AI 어드바이스 본문, 일반 본문 | `.ai-suggest .txt` |
| 12.5 | 400 | 카드 부제, 방법 설명 | `.card-sub`, `.fc-method` |

### Label · 캡션
| px | weight | 용도 | 예시 |
|---|---|---|---|
| 12 | 600 | 섹션 라벨, 범례 | `.fc-factors-head`, `.tm-legend` |
| 11.5 | 600 | 출처 헤드, 데이터 신선도 | `.hero-source-head`, `.freshness` |
| 11 | 500~600 | 키 라벨, 축 라벨 | `.hsrc .k`, `.pm .k` |

### Micro · 마이크로
| px | weight | 용도 | 예시 |
|---|---|---|---|
| 10.5 | 600~700 | 칩, 작은 버튼, 표 헤더 | `.feechip`, `.box-connect` |
| 10 | 700 | 카드사 칩 | `.cardchip` |
| 9.5 | 600 | 메뉴 시간축 눈금 | `.tm-hours span` |

## 4. 굵기(weight) 컨벤션

전체를 기존 대비 100씩 낮춘 결과, 현재 4단계는 다음과 같습니다.

| weight | 의미 | 사용 빈도 | (이전) |
|---|---|---|---|
| **700** | 제목·핵심 수치·강한 강조 | 가장 많음 | 800 |
| **600** | 라벨·칩·중간 강조 | 많음 | 700 |
| **500** | 중간 본문·보조 텍스트 | 보통 | 600 |
| **400** | 일반 본문·설명 문장 | 보통 | 500 |

> 조정 전에는 최소 굵기가 500이었으나, 전체 -100 적용으로 현재 가장 가벼운 본문은 **400(Regular)** 입니다.

## 5. 보조 규칙

- **line-height**: 본문 `1.5`, 설명 문장 `1.6~1.65`, 수치/제목은 `1`~`1.2`로 타이트하게
- **letter-spacing**: 전역 **`-0.03em` (-3%)** — Pretendard 기본보다 살짝 좁혀 밀도감을 줌 (`body`에 적용 후 상속, 기존 `letter-spacing:0` 선언도 모두 `-0.03em`로 교체)
- **숫자 정렬**: 수치 표시 요소는 `font-variant-numeric: tabular-nums`로 자릿수 고정 (금액·퍼센트·건수 등)
- **금액 표기**: `₩` 기호 대신 한글 `원` 사용 (예: `1,485,000원`)

## 6. 텍스트 색상 토큰

| 토큰 | 값 | 용도 |
|---|---|---|
| `--ink` | `#101010` | 본문 기본·핵심 수치 |
| `--ink-2` | `#212121` | 보조 본문·라벨 |
| `--ink-3` | `rgba(49,49,49,.64)` | 캡션·비활성 텍스트 |
| `--brand-ink` | `#3d1400` | 브랜드 강조 텍스트 |
| `--good` | `#119a56` | 긍정 지표(상승) |
| `--warn` | `#ff5a0a` | 주의·경고 |
| `--blue` | `#007cff` | 중립 비교 지표 |
