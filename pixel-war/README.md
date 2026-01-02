# REFERENCE Pixel War

> 전략 팀빌딩 솔루션 - 실시간 픽셀 배치를 통한 팀워크, 자원 관리, 전략적 의사결정 시뮬레이션

© 2026 REFERENCE HRD. All Rights Reserved.

## 개요

REFERENCE Pixel War는 기업 교육용 팀빌딩 솔루션입니다. 참가자들은 실시간으로 캔버스에 픽셀을 배치하며 팀 협동, 자원 관리, 전략적 의사결정을 체험합니다.

## 기술 스택

- **Frontend**: React.js, Tailwind CSS, Lucide Icons
- **Backend/Database**: Firebase (Firestore - Realtime Sync)
- **State Management**: Zustand
- **Audio**: Web Audio API

## 기능

### 1. 참여자 화면 (Participant)
- 세션 ID 및 닉네임으로 간편 참여
- 실시간 픽셀 배치 (쿨타임 적용)
- 개인 대시보드 (남은 픽셀, 쿨타임, 팀 점수)
- 모바일 최적화 터치 인터페이스

### 2. 강사 콘솔 (Instructor)
- 교육 차수별 세션 생성/관리
- 타이머 컨트롤 (Start/Pause/Reset)
- 게임 모드 전환 (팀전/개인전)
- 렌더링 방식 선택 (실시간/배치/10초 주기)
- 돌발 이벤트 활성화 (인베이전 5배 가점 등)

### 3. 공통 대시보드 (Dashboard)
- 대형 스크린용 고해상도 전체 캔버스 뷰
- 실시간 리더보드 및 점유율 그래프
- Victory 연출 및 통계 리포트

### 4. 관리자 대시보드 (Admin)
- 강사 계정 발급 및 관리
- 전체 세션 데이터 로그 및 엑셀 다운로드
- 미션 커스터마이징

## 점수 체계

| 행동 | 점수 |
|------|------|
| 홈그라운드 방어 | 1점 |
| 적진 침투 (Invasion) | 3점 |
| 이벤트 시 배수 | 최대 5배 |

## 실행 방법

```bash
# 의존성 설치
cd pixel-war
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build
```

## 환경 변수

Firebase 연동을 위해 `.env` 파일에 다음 변수를 설정하세요:

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

## 디자인 시스템

- **Base Style**: Glassmorphism (반투명 카드, 블러 효과)
- **Color**: Deep Black (#050505) + Electric Blue (#00d4ff) + Radiant Purple (#a855f7)
- **Typography**: Inter (UI), JetBrains Mono (숫자/코드)

## 라이선스

© 2026 REFERENCE HRD. All Rights Reserved.

이 소프트웨어는 REFERENCE HRD의 독점 자산입니다.
