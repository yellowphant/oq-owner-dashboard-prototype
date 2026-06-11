# OQ 사장님 대시보드

사장님 대시보드 정적 프로토타입과 개발 핸드오프 문서를 관리하는 저장소입니다.

## 프로젝트 구조

```text
.
├── index.html
├── docs/
│   ├── cto-api-design-handoff.md
│   ├── oq-owner-dashboard-api-feasibility-check.md
│   └── oq-owner-dashboard-handoff.md
├── vercel.json
└── README.md
```

- `index.html`: 현재 최신 배포본
- `docs/`: CTO/API/디자인 핸드오프 문서
- `vercel.json`: Vercel 정적 사이트 배포 설정

## 로컬 확인

별도 빌드 없이 `index.html`을 열거나 정적 파일 서버로 실행합니다.

```bash
python3 -m http.server 3000
```

브라우저에서 `http://localhost:3000`을 엽니다.

## Vercel 배포

Vercel에서 GitHub 저장소를 연결하고 Framework Preset을 `Other`로 선택합니다.
빌드 명령과 출력 디렉터리는 비워 둡니다. 저장소 루트의 `index.html`이 배포됩니다.

배포 URL: https://oq-owner-dashboard-prototype.vercel.app

## 이전 위치

이 프로젝트는 아래 작업 폴더의 최신 산출물을 기준으로 이전했습니다.

```text
/Users/wooojooon/Documents/Codex/2026-06-01/files-mentioned-by-the-user-oq
```

이전일: 2026-06-11
