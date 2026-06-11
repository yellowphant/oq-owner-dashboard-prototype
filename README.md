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
├── .github/workflows/deploy-pages.yml
├── vercel.json
└── README.md
```

- `index.html`: 현재 최신 배포본
- `docs/`: CTO/API/디자인 핸드오프 문서
- `.github/workflows/deploy-pages.yml`: GitHub Pages 자동 배포
- `vercel.json`: Vercel 정적 사이트 배포 설정

## 로컬 확인

별도 빌드 없이 `index.html`을 열거나 정적 파일 서버로 실행합니다.

```bash
python3 -m http.server 3000
```

브라우저에서 `http://localhost:3000`을 엽니다.

## GitHub Pages 배포

1. 이 폴더를 GitHub 저장소에 push합니다.
2. 저장소의 `Settings > Pages`에서 Source를 `GitHub Actions`로 선택합니다.
3. `main` 브랜치에 push하면 워크플로가 루트의 정적 파일을 배포합니다.

## Vercel 배포

Vercel에서 GitHub 저장소를 연결하고 Framework Preset을 `Other`로 선택합니다.
빌드 명령과 출력 디렉터리는 비워 둡니다. 저장소 루트의 `index.html`이 배포됩니다.

## 이전 위치

이 프로젝트는 아래 작업 폴더의 최신 산출물을 기준으로 이전했습니다.

```text
/Users/wooojooon/Documents/Codex/2026-06-01/files-mentioned-by-the-user-oq
```

이전일: 2026-06-11

