# 한동대학교 AI 가속기 안내 웹사이트

한동대학교 AI 혁신센터가 운영하는 GPU 기반 AI 연구 인프라를 소개하고, 장비 사양과 이용 절차·요금·문의 방법을 안내하는 공식 랜딩 페이지입니다.

## 주요 내용

- 한동대학교 AI 혁신센터 및 지원 연구 분야 소개
- AIPub를 중심으로 구성된 AI 인프라 구조 안내
- NVIDIA B200, NVIDIA RTX PRO 6000 장비 소개
- NVIDIA GB200 NVL72 도입 예정 안내
- 이용 신청부터 자원 반환까지의 절차 안내
- 이용 요금 및 취소·환불 정책 안내 틀
- FAQ와 문의 접수 폼

## 화면 및 인터랙션

- 데스크톱에서는 주요 섹션이 한 화면씩 전환되는 스크롤 기반 장면과 스냅 동작을 사용합니다.
- 모바일에서는 일반적인 세로 스크롤 중심의 반응형 레이아웃으로 동작합니다.
- 첫 화면에는 한동대학교 AI 혁신센터 로고를 활용한 드래그 가능한 3D 코인이 표시됩니다.
- AI 인프라 화면은 연구자 → AIPub → GPU·스토리지의 이용 구조를 다이어그램으로 보여줍니다.
- `prefers-reduced-motion` 환경에서는 움직임을 줄입니다.

## 기술 스택

- React 19, TypeScript
- Next.js 정적 export
- Three.js, React Three Fiber
- Radix UI / shadcn UI
- Lucide React
- GitHub Pages 호스팅
- Cloudflare Worker 기반 문의 API
- Resend 문의 메일 API

## 로컬 실행

### 요구 환경

- Node.js 22.13.0 이상
- npm

### 설치 및 개발 서버

```bash
npm install
npm run dev
```

기본 개발 주소는 [http://localhost:5173](http://localhost:5173)입니다.

### 검사 및 정적 빌드

```bash
npm run lint
npm run build
```

정적 결과물은 `out/`에 생성됩니다. GitHub Pages와 동일한 저장소 하위 경로로 직접 확인하려면 PowerShell에서 다음처럼 빌드합니다.

```powershell
$env:NEXT_PUBLIC_BASE_PATH="/hgu-ai-accelerator"
npm run build
```

## 문의 폼 서버리스 함수

GitHub Pages에는 서버 실행 환경이 없으므로 문의 폼은 별도의 Cloudflare Worker가 Resend API를 호출합니다. 로컬 `.env`에는 다음 값을 설정합니다.

```env
NEXT_PUBLIC_CONTACT_API_URL=http://127.0.0.1:8787/contact
NEXT_PUBLIC_BASE_PATH=
RESEND_API_KEY=re_xxxxxxxxxx
CONTACT_TO_EMAIL=receiver@example.com
CONTACT_FROM_EMAIL=AI Accelerator <verified-sender@example.com>
```

- `NEXT_PUBLIC_CONTACT_API_URL`: 브라우저에서 호출할 문의 Worker 주소
- `RESEND_API_KEY`: Resend API 키
- `CONTACT_TO_EMAIL`: 문의를 받을 이메일 주소
- `CONTACT_FROM_EMAIL`: 발신자 주소. 생략하면 개발용 기본 주소가 사용됩니다.

`CONTACT_FROM_EMAIL`에 실제 도메인 주소를 사용할 경우 Resend에서 해당 도메인 또는 발신자를 먼저 인증해야 합니다. `.env` 파일과 API 키는 Git에 커밋하지 마세요.

로컬 Worker 실행 및 타입 검사는 다음 명령을 사용합니다.

```bash
npm run contact:dev
npm run contact:typecheck
```

프로덕션에서는 Worker Secret을 포함해 배포합니다.

```bash
npm run contact:deploy -- --secrets-file .env
```

배포가 끝나면 GitHub Pages 빌드 환경의 `NEXT_PUBLIC_CONTACT_API_URL`을 발급된 Worker 주소의 `/contact` 경로로 설정합니다.

## 프로젝트 구조

```text
site/
├─ .github/workflows/
│  └─ deploy-pages.yml       # main 브랜치 GitHub Pages 자동 배포
├─ app/
│  ├─ globals.css            # 전체 스타일, 장면 전환, 반응형 규칙
│  ├─ layout.tsx             # 메타데이터와 공통 레이아웃
│  └─ page.tsx               # 내비게이션과 전체 페이지 콘텐츠
├─ components/
│  ├─ HeroCoin.tsx           # 첫 화면의 인터랙티브 3D 코인
│  └─ ui/                    # 공통 UI 컴포넌트
├─ contact-worker/
│  ├─ src/index.ts           # GitHub Pages용 문의 서버리스 함수
│  └─ wrangler.jsonc         # Cloudflare Worker 설정
├─ public/
│  ├─ HGUlogo.png            # 헤더와 3D 코인 로고
│  ├─ text_logo.png          # 푸터 로고
│  ├─ b200.png               # NVIDIA B200 이미지
│  ├─ pro6000.png            # NVIDIA RTX PRO 6000 이미지
│  ├─ nvl72.webp             # NVIDIA GB200 NVL72 이미지
│  └─ images/                # 인프라 다이어그램용 이미지
└─ next.config.ts            # 정적 export와 GitHub Pages base path 설정
```

## 콘텐츠 수정 가이드

- 메뉴, 섹션 순서, 장비 사양, 이용 절차, 요금, FAQ, 문의 문구: `app/page.tsx`
- 배치, 색상, 크기, 스크롤 전환, 모바일 스타일: `app/globals.css`
- 3D 로고 코인의 크기·회전·조명·조작감: `components/HeroCoin.tsx`
- 문의 메일 검증과 본문 형식: `contact-worker/src/index.ts`
- 페이지 제목, 설명, 파비콘: `app/layout.tsx`
- 로고와 장비 이미지: `public/`

정적 이미지를 교체할 때 기존 파일명과 투명 배경을 유지하면 코드 수정 없이 반영할 수 있습니다. 이미지 비율이 달라지는 경우 `app/globals.css`의 해당 이미지 스타일도 함께 확인하세요.

## 현재 페이지 순서

1. 소개
2. AI 인프라
3. NVIDIA B200
4. NVIDIA RTX PRO 6000
5. NVIDIA GB200 NVL72 (도입 예정)
6. 이용방법
7. 이용요금
8. FAQ
9. 문의

## 배포

이 프로젝트는 `main` 브랜치에 변경 사항을 푸시하면 GitHub Actions가 정적 사이트를 빌드해 GitHub Pages로 배포합니다.

저장소의 `Settings → Pages → Build and deployment → Source`를 `GitHub Actions`로 설정합니다. 문의 Worker를 배포한 뒤 `Settings → Secrets and variables → Actions → Variables`에 다음 저장소 변수를 추가합니다.

```text
Name: NEXT_PUBLIC_CONTACT_API_URL
Value: https://<worker-name>.<account>.workers.dev/contact
```

`RESEND_API_KEY`는 GitHub에 넣지 않고 Cloudflare Worker Secret으로만 관리합니다.

GitHub Pages 주소: [https://ax-center.github.io/hgu-ai-accelerator/](https://ax-center.github.io/hgu-ai-accelerator/)
