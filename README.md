# FishBase Dashboard

GBIF 형식의 FishBase 데이터를 활용한 인터랙티브 지도 기반 어종 대시보드

## 기능

- 🗺️ 전 세계 어종 분포를 지도에 시각화
- 🔍 다양한 필터링 옵션 (과, 속, 국가, 연도)
- 📊 실시간 데이터베이스 통계
- 📋 어종 목록 보기 및 상세 정보
- 🎯 마커 클러스터링으로 대량 데이터 효율적 표시

## 시작하기

### 필수 요구사항

- Node.js 18.0 이상
- Docker 및 Docker Compose
- PostgreSQL (Docker로 실행)

### 설치 및 실행

1. 의존성 설치
```bash
npm install
```

2. PostgreSQL 데이터베이스 시작
```bash
docker compose up -d
```

3. Prisma 설정
```bash
npx prisma generate
npx prisma migrate dev --name init
```

4. CSV 데이터 임포트
```bash
npm run import-data
```

5. 개발 서버 실행
```bash
npm run dev
```

6. 브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

## 프로젝트 구조

```
fishbase-dashboard/
├── app/                    # Next.js App Router
│   ├── api/               # API 라우트
│   ├── globals.css        # 전역 스타일
│   ├── layout.tsx         # 루트 레이아웃
│   └── page.tsx           # 메인 페이지
├── components/            # React 컴포넌트
│   ├── Map/              # 지도 관련 컴포넌트
│   ├── Filters/          # 필터 컴포넌트
│   ├── Species/          # 어종 목록/카드 컴포넌트
│   └── Stats/            # 통계 컴포넌트
├── prisma/               # Prisma 스키마 및 마이그레이션
├── scripts/              # 유틸리티 스크립트
│   └── import-csv.ts     # CSV 데이터 임포트 스크립트
├── public/               # 정적 파일
└── docker-compose.yml    # Docker 설정
```

## 데이터베이스

PostgreSQL 데이터베이스는 Docker로 실행되며, 다음 접속 정보를 사용합니다:

- Host: localhost
- Port: 5432
- Database: fishbase
- User: fishuser
- Password: fishpass

Prisma Studio로 데이터베이스 확인:
```bash
npx prisma studio
```

## 개발 명령어

```bash
# 린트 실행
npm run lint

# 타입 체크
npm run type-check

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start
```

## 환경 변수

`.env` 파일에 다음 환경 변수가 필요합니다:

```
DATABASE_URL="postgresql://fishuser:fishpass@localhost:5432/fishbase?schema=public"
NEXT_PUBLIC_MAP_TILE_URL="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
```

## 라이선스

이 프로젝트는 MIT 라이선스 하에 있습니다.