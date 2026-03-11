# 사주TI 웹 MVP 개발 PRD

## 1. 문서 메타

- **문서명**: `PRD.md`
- **제품명**: 사주TI
- **문서 버전**: `v1.2`
- **문서 성격**: Claude Code 구현 지시용 개발 PRD
- **현재 단계 목표**:
  - Next.js 기반의 모바일 반응형 웹 MVP를 구축한다.
  - 이번 단계에서는 LLM 해석 없이, 사주 계산 결과를 구조화하여 저장·조회·렌더링하는 서비스와 그에 맞는 디자인 시스템을 함께 정의한다.
- **핵심 구현 축**:
  1. 입력 수집
  2. 사주 계산
  3. 결과 정규화 및 저장
  4. 결과 렌더링
  5. 일관된 디자인 시스템 적용

---

## 2. 프로젝트 배경 및 목표

### 2.1 문제 정의

- MBTI에 익숙한 사용자는 많지만, 사주는 용어와 표현 방식 때문에 진입장벽이 높다.
- 기존 사주 서비스는 긴 텍스트 나열 또는 용어 중심 화면이 많아, 계산 결과를 빠르게 이해하기 어렵다.
- 이번 MVP는 LLM 해석보다 먼저, 사주 계산 결과를 안정적으로 구조화·저장·조회·렌더링하는 기반을 만드는 데 집중한다.

### 2.2 핵심 사용자 가치

- 주요 사용자: MBTI에는 익숙하지만 사주는 어렵게 느끼는 한국어 사용자
- 사용자는 이름, 성별(계산용), 생년월일시, MBTI만 입력하면 복잡한 사주 계산 결과를 읽기 쉬운 카드형 UI로 확인할 수 있다.
- 출생 시간을 모르더라도 핵심 결과를 확인할 수 있어 입력 장벽이 낮다.
- MBTI는 이번 단계에서 입력 맥락과 자기이해의 친숙한 기준점으로 사용하고, 후속 버전에서 사주-MBTI 교차 해석으로 확장할 수 있는 기반을 만든다.

### 2.3 제품 목표

사용자가 이름, 성별, 생년월일시, MBTI를 입력하면 서버에서 사주를 계산하고, 그 결과를 읽기 쉬운 카드형 UI와 목업 리포트로 보여주는 자기이해형 웹서비스를 만든다.

### 2.4 이번 MVP에서 반드시 달성할 것

1. 랜딩 페이지가 존재한다.
2. 입력 폼이 동작한다.
3. 입력값 검증이 된다.
4. 서버에서 사주 계산이 실행된다. (mock 포함)
5. 계산 결과가 저장된다.
6. 결과 페이지에서 구조화된 결과가 렌더링된다.
7. 출생 시간 미상 케이스가 처리된다.
8. 향후 LLM 해석 기능을 붙일 수 있도록 raw/normalized 구조가 분리된다.
9. shadcn + Tailwind 기반의 디자인 시스템이 적용된다.
10. 모바일 우선 반응형 레이아웃이 적용된다.

### 2.5 이번 MVP의 성공 조건

- 사용자가 **입력 → 생성 → 결과 확인**까지 막힘 없이 진행할 수 있다.
- 결과 페이지에서 최소 아래 항목이 보인다.
  - 입력 요약
  - 사주 4주(또는 시간 미상 기준 결과)
  - 일간
  - 오행 분포
  - 대운
  - MBTI 입력값
  - 규칙형 목업 리포트
- 계산 실패, 잘못된 입력, 결과 없음 상태가 모두 처리된다.
- UI가 모바일 화면에서 자연스럽게 읽히고 조작 가능하다.
- 오로라 배경은 브랜드 인상에는 기여하지만 가독성을 해치지 않도록 제한적으로 사용된다.

### 2.6 제품 성공 지표

| 지표 | 목표 | 측정 방식 |
|------|------|-----------|
| 결과 처리 완료율 | 유효 제출 대비 `95% 이상` | 앱 로그 기준 유효 제출 수 대비 `publicId` 발급 후 결과 라우트 이동 완료 수 |
| 정상 결과 생성률 | 유효 제출 대비 `90% 이상` | `status = success` 결과 수를 유효 제출 수로 나누어 측정 |
| 실패 결과 비율 | 유효 제출 대비 `10% 이하` | `status = failed` 결과 수를 유효 제출 수로 나누어 측정 |
| 제출 → 결과 페이지 이동 시간 | `p95 5초 이하` | 서버/클라이언트 로그 기준, cold start 제외 |
| 저장된 결과 조회 성공률 | 존재하는 `publicId` 조회의 `99% 이상` | 결과 조회 로그 및 not found 오탐 비율 확인 |
| 품질 게이트 | 배포 전 핵심 E2E `100% 통과` | CI에서 happy path / 시간 미상 / 오류 시나리오 통과 여부 확인 |

### 2.7 주요 리스크 및 대응

| Risk | Impact | Mitigation |
|------|--------|------------|
| `orrery` 라이선스 또는 런타임 제약 | High | Phase 0 스파이크로 라이선스, Node.js runtime, 샘플 출력 가능 여부를 먼저 검증하고 adapter 인터페이스를 유지한다. |
| 계산 엔진 raw output shape 변동 또는 누락 데이터 | Medium | raw/normalized 계층을 분리하고, normalization은 null-safe 하게 작성하며 샘플 케이스 테스트를 확보한다. |
| 공개 결과 URL을 통한 개인정보 노출 우려 | Medium | `publicId`, 이름 마스킹, `noindex`, 30일 보존 정책, 결과 URL 열람 고지 문구를 함께 적용한다. |
| MVP 범위 팽창으로 인한 일정 지연 | Medium | LLM 해석, 공유, 음력 입력, 계정 기능은 이번 단계 Out of Scope로 유지하고 Phase 기준으로 차단한다. |

---

## 3. 제품 개요

### 3.1 한 줄 설명

사주TI는 사용자의 기본 정보를 입력받아 사주 계산 결과를 구조화해 보여주는 자기이해형 웹서비스의 MVP다.

### 3.2 이번 단계의 산출물 정의

이번 단계의 결과물은 **"잘 작동하는 계산 기반 결과 서비스 + 브랜드 일관성이 있는 UI 시스템"**이다.

즉, 핵심은 아래 다섯 가지다.

1. 입력 수집
2. 사주 계산
3. 결과 정규화 및 저장
4. 결과 렌더링
5. 디자인 시스템 및 UI 컴포넌트 체계 정립

### 3.3 이번 단계에서 하지 않는 것

- 자연어 기반 2,000~3,000자 LLM 해석 리포트 생성
- LLM 시스템 프롬프트 설계
- 자유 질문 / 추천 질문
- 궁합 분석
- 로그인 / 회원가입
- 결제 / 구독
- 음력 입력
- 출생지 입력
- 다국어 지원
- 관리자 페이지
- SNS 공유 기능
- 복잡한 개인화 테마 선택 기능

---

## 4. 범위 정의

### 4.1 In Scope

- Next.js App Router 기반 웹앱
- TypeScript 기반 구현
- shadcn/ui 기반 컴포넌트 구조
- Tailwind CSS 기반 디자인 토큰 적용
- 입력 페이지
- 결과 페이지
- 서버 측 사주 계산
- 계산 결과 정규화
- 결과 저장 및 조회
- 공개 조회용 비연속 `publicId` 발급 및 조회
- 시간 미상 처리
- 규칙형 목업 리포트 생성
- 30일 보존 정책 및 만료 결과 cleanup use case
- 기본 반응형 UI
- 기본 에러 처리
- 핵심 테스트 작성
- 브랜드형 랜딩 Hero + AuroraBackground
- 결과/폼 화면용 카드형 인터페이스

### 4.2 Out of Scope

- 해석 LLM
- 후속 질문 기능
- 소셜 기능
- 결제
- 사용자 계정
- 관리자 대시보드
- 운영용 백오피스
- 고급 분석 대시보드
- 푸시/이메일 알림
- 음력/윤달 계산 입력 UI
- 복수 언어 지원
- 대규모 애니메이션 시스템
- 커스텀 테마 편집기
- 다크모드 토글 UI

---

## 5. 가정 (Assumptions)

1. **서비스는 한국 사용자 기준**으로 시작하며, 기본 타임존은 `Asia/Seoul`이다.
2. 생년월일은 **양력 기준**으로 입력받는다.
3. 출생지는 입력받지 않는다.
4. 출생 시간은 옵션이다.
5. 사용자가 **시만 입력하고 분을 비우면 분은 `00`으로 보정**한다.
6. 사용자가 출생 시간을 비우면 `missingTime = true`로 처리한다.
7. MBTI는 사용자가 **직접 선택**한다. 테스트 기능은 없다.
8. MVP에서 성별은 계산 일관성을 위해 **`male | female`** 2값만 지원한다.
   UI 라벨은 **`성별(계산용)`** 으로 표기한다.
9. 사주 계산 엔진은 우선 `orrery` 사용을 전제로 하나, 구현은 반드시 **어댑터 계층** 뒤에 둔다.
10. 결과 URL의 path parameter는 `ReportResult.publicId`이며, 내부 `id`와 `requestId`는 외부에 노출하지 않는다.
11. 개인정보 성격을 고려해 결과 페이지는 검색엔진에 노출되지 않도록 `noindex`, `nofollow`, `noarchive` 처리한다.
12. 결과 페이지에 표시되는 이름은 기본적으로 일부 마스킹된 표시값을 사용한다.
13. UI는 **"신비롭지만 가볍고 읽기 쉬운"** 방향을 목표로 한다.
14. 오로라 배경은 **랜딩 Hero 또는 상단 소개 영역에만 사용**하고, 결과 페이지 본문 전체 배경으로 사용하지 않는다.
15. 모바일 390px 폭 전후를 기본 기준으로 설계한다.
16. 기본 다크모드 CSS 호환은 포함하되, MVP에는 사용자 다크모드 토글을 넣지 않으며 우선순위는 라이트모드 완성도다.
17. 배포 런타임은 **Node.js server runtime**을 사용하며, 계산 및 DB 로직에 Edge runtime을 사용하지 않는다.
18. 운영 환경은 일 1회 만료 결과 cleanup job 실행이 가능해야 한다.
19. raw 결과 디버그 UI는 `development` 환경이면서 별도 env flag가 켜진 경우에만 허용한다.

---

## 6. 사용자 시나리오

### 6.1 시나리오 A - 일반 입력

1. 사용자가 랜딩 페이지에 진입한다.
2. "사주 결과 보기" CTA를 누른다.
3. 입력 폼에서 이름, 성별(계산용), 생년월일, MBTI를 입력한다.
4. 출생 시간을 알고 있다면 시/분도 입력한다.
5. 제출한다.
6. 서버가 계산 및 저장을 수행한다.
7. 결과 페이지로 이동한다.
8. 사용자는 구조화된 결과를 확인한다.

### 6.2 시나리오 B - 출생 시간 미상

1. 사용자가 출생 시간을 입력하지 않는다.
2. 서버는 시간 미상 기준 계산을 수행한다.
3. 결과 페이지 상단에 `출생 시간 미상 기준 결과` 배지를 노출한다.
4. 시주가 필요한 정보는 비워두거나 안내 문구를 표시한다.

### 6.3 시나리오 C - 입력 오류

1. 사용자가 잘못된 날짜 또는 MBTI 미선택 상태로 제출한다.
2. 클라이언트/서버 검증이 실패한다.
3. 필드별 오류 메시지가 표시된다.
4. 사용자는 기존 입력값을 유지한 채 수정 후 재제출할 수 있다.

### 6.4 시나리오 D - 결과 없음

1. 사용자가 존재하지 않는 결과 URL에 접근한다.
2. 시스템은 `not found` 상태를 보여준다.
3. 사용자는 다시 입력 페이지로 돌아갈 수 있다.

### 6.5 시나리오 E - 계산 실패

1. 서버가 계산 라이브러리 오류 또는 예외를 만난다.
2. 결과 저장 시 상태를 `failed`로 남긴다.
3. 사용자는 failed 결과 페이지에서 이해 가능한 오류 메시지를 보고 다시 시도한다.

---

## 7. 핵심 요구사항

### 7.1 우선순위 요약

| ID | Requirement | Priority | Dependencies |
|----|-------------|----------|--------------|
| FR-001 | 이름, 성별(계산용), 생년월일, MBTI 입력 및 기본 검증 | P0 | - |
| FR-002 | 출생 시/분 옵션 입력 및 시간 미상 규칙 처리 | P0 | FR-001 |
| FR-003 | 서버 전용 사주 계산, engine adapter, normalized 변환 | P0 | FR-001, FR-002 |
| FR-004 | request/result 분리 저장, `publicId` 발급, 결과 조회 | P0 | FR-003 |
| FR-005 | 결과 페이지 핵심 카드 렌더링 및 `success` / `failed` / `not found` 처리 | P0 | FR-004 |
| FR-006 | 규칙형 목업 리포트 생성 | P1 | FR-003 |
| FR-007 | 랜딩 Hero, AuroraBackground, 공통 카드 UI 적용 | P1 | FR-001, FR-005 |
| FR-008 | 만료 결과 cleanup job 및 핵심 테스트 | P1 | FR-004 |
| FR-009 | raw debug UI (`development` + env flag) | P2 | FR-003 |
| FR-010 | 기본 다크모드 CSS 호환성 유지 (토글 UI 제외) | P2 | FR-007 |

### 7.2 입력 수집

사용자로부터 아래 입력을 받는다.

#### 필수 입력

- 이름
- 성별(계산용)
- 생년월일
- MBTI

#### 선택 입력

- 출생 시
- 출생 분

### 7.3 입력 검증

- 이름: 공백 제거 후 1자 이상
- 생년월일: `YYYY-MM-DD` 형식 문자열
- 생년월일: 유효한 날짜
- 생년월일: 미래 날짜 불가
- 생년월일: 최소 허용값 `1900-01-01`
- 출생 시: `0 ~ 23`
- 출생 분: `0 ~ 59`
- 출생 분만 단독 입력은 불가
- MBTI: 16개 enum 중 하나만 허용
- 성별(계산용): `male | female`

### 7.4 계산 실행

- 제출은 서버에서 처리한다.
- 사주 계산은 반드시 **서버 전용 로직**으로 실행한다.
- 라이브러리 출력은 그대로 UI에 사용하지 않고, 앱 내부 표준 형태로 정규화한다.

### 7.5 결과 저장

- 입력 원본과 계산 결과를 분리 저장한다.
- 결과 조회용 `publicId`를 계산 결과 레코드에 별도로 발급한다.
- raw 결과와 normalized 결과를 모두 저장한다.
- 규칙형 목업 리포트도 저장한다.
- 만료 기준은 생성 시각 기준 30일이며, 만료 데이터는 cleanup use case를 통해 삭제 가능해야 한다.

### 7.6 결과 렌더링

결과 페이지에는 최소 아래 블록이 있어야 한다.

1. 헤더
2. 생성 정보
3. 입력 요약
4. 사주 4주/3주
5. 일간
6. 오행 분포
7. 대운
8. MBTI
9. 목업 리포트
10. 하단 액션

### 7.7 목업 리포트

이번 단계에서는 LLM 없이, 정규화 결과 기반의 **규칙형 설명 블록**만 제공한다.

---

## 8. 화면 / 라우트 명세

### 8.1 페이지 라우트

- `GET /`
- `GET /report/new`
- `GET /report/[id]` (`id`는 `ReportResult.publicId`)

### 8.2 `/` - 랜딩 페이지

#### 목적

서비스 소개 및 입력 흐름 진입

#### 필수 요소

- 제품명
- 한 줄 설명
- 시작 CTA
- 간단한 예시 카드
- 참고용 서비스 고지

#### 시각적 요구사항

- 상단 Hero에 AuroraBackground 사용
- 중앙 정렬 레이아웃
- 브랜드 메시지는 짧고 선명하게
- CTA는 1개를 가장 강하게 보여준다
- Hero 아래에는 서비스 설명 카드 2~3개 배치 가능

#### CTA

- `"사주 결과 보기"` → `/report/new`

#### 상태

- 기본 상태만 우선 구현

### 8.3 `/report/new` - 입력 페이지

#### 목적

사용자 입력 수집 및 생성 요청

#### 필수 UI 요소

- 이름 입력 필드
- 성별(계산용) 선택
- 생년월일 필드
- 출생 시 필드
- 출생 분 필드
- MBTI 선택 UI
- 제출 버튼
- 오류 메시지 영역

#### UX 규칙

- 시간 입력 옆에 `모르면 비워두세요` 안내 문구 표시
- 시만 입력된 경우 분은 `00`으로 보정한다는 안내 제공
- 제출 중 버튼 비활성화
- 제출 실패 시 입력값 유지
- 필드별 오류는 해당 필드 아래에 표시
- 폼 하단에 `결과 URL을 아는 사람은 결과를 열람할 수 있으며, 결과는 30일 후 자동 삭제된다` 고지 표시

#### 시각적 요구사항

- 본문 배경은 부드러운 단색 또는 미세한 그라데이션
- 입력 폼은 큰 카드 1개 안에 정리
- 모바일에서는 1열 배치
- 데스크톱에서는 최대 폭 `480~560px` 정도 유지
- MBTI는 16개 전부를 빠르게 선택할 수 있는 버튼형 UI로 제공한다. 기본 권장안은 `4x4 grid`다
- 주요 버튼은 브랜드 primary 스타일 사용

#### 상태

- `idle`
- `validating`
- `submitting`
- `field error`
- `server error`

#### MBTI 선택 UI

MBTI 선택 UI의 **기본 권장안은 4×4 그리드**다. 다만 더 좁은 모바일 폭에서는 가독성과 터치 타깃을 우선해 동일한 버튼형 선택 경험을 유지하는 범위에서 열 수와 배치를 조정할 수 있다.

- 기본 레이아웃: 4행 4열 버튼 그리드
- 각 셀에는 MBTI 4글자를 명확히 표시한다
- 선택된 버튼은 primary 색상 배경 + white 텍스트
- `390px` 전후 폭에서는 4열 구성을 우선 검토한다
- 더 좁은 폭에서는 스크롤 없는 억지 4열 고정보다 가독성과 터치 타깃을 우선한다
- 드롭다운은 기본 권장안이 아니며, 버튼형 선택 UI를 우선한다

### 8.4 `/report/[id]` - 결과 페이지

#### 목적

계산 결과 조회

#### 필수 섹션 순서

1. 결과 헤더
2. 상태 배지 / 생성 시각
3. 입력 요약 카드
4. 사주팔자 카드
5. 일간 카드
6. 오행 분포 카드
7. 대운 카드
8. MBTI 카드
9. 목업 리포트 카드
10. 다시 해보기 버튼

#### 표시 규칙

- `missingTime = true`면 상단에 시간 미상 배지 노출
- 시주가 없으면 `시주 정보 없음` 또는 안내 문구 노출
- 이름은 일부 마스킹된 표시값으로 노출
- raw engine output은 사용자 UI에 기본 노출하지 않음
- raw 토글은 `development` + env flag 조합에서만 허용하며 preview/prod에서는 노출하지 않음
- 계산 실패 결과도 동일한 `/report/[publicId]` 경로에서 failed 상태 카드와 재시도 CTA를 보여준다

#### 시각적 요구사항

- 읽기성이 최우선
- 결과 카드 사이 간격은 충분히 확보
- 텍스트 블록은 60~75자 폭을 넘지 않도록 제한
- 카드 배경은 반투명보다는 높은 가독성의 단색/살짝 유리감 있는 스타일 사용
- 오로라 배경은 본문 전체에 쓰지 않고, 상단 헤더 배경 또는 아주 약한 상단 장식으로만 사용

#### 상태

- `loading`
- `success`
- `failed`
- `not found`

---

## 9. 정보 구조

### 9.1 전체 흐름

`랜딩` → `입력` → `서버 계산` → `정규화` → `저장` → `결과 렌더링`

### 9.2 결과 페이지 정보 계층

1. **이 결과가 무엇인지**
2. **어떤 입력으로 계산되었는지**
3. **계산 핵심 결과가 무엇인지**
4. **이를 쉽게 읽는 목업 설명은 무엇인지**
5. **다시 시도하거나 새 결과를 만들 수 있는지**

### 9.3 결과 섹션 설계 원칙

- 상단은 **요약**
- 중단은 **구조화된 계산 결과**
- 하단은 **설명형 텍스트**
- 가장 중요한 값은 카드 형태로 분리
- 어려운 용어는 짧은 보조 설명을 붙인다

---

## 10. 기술 스택 및 제약

### 10.1 권장 기술 스택

- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Base**: shadcn/ui
- **Animation**: framer-motion
- **Validation**: Zod
- **ORM**: Prisma
- **DB (dev)**: SQLite
- **DB (prod-ready structure)**: PostgreSQL 전환 가능 구조
- **Testing**:
  - Unit / Integration: Vitest
  - Component: React Testing Library
  - E2E: Playwright
- **Icons**: lucide-react

### 10.2 기술 선택 이유

- Next.js App Router는 서버 로직과 페이지 렌더링을 자연스럽게 분리하기 쉽다.
- TypeScript strict mode는 도메인 데이터 구조를 안정적으로 관리하는 데 유리하다.
- Prisma는 MVP에서 모델링과 마이그레이션 속도가 빠르다.
- Zod는 폼 검증과 서버 입력 검증을 동일한 스키마로 재사용하기 좋다.
- shadcn/ui는 커스터마이즈 가능한 기본 컴포넌트와 디자인 일관성을 제공한다.
- framer-motion은 Hero와 미세한 등장 애니메이션에 충분하며 과하지 않다.

### 10.3 기술 제약

- 계산 엔진은 반드시 서버에서만 실행한다.
- 계산/DB 경로에 Edge runtime을 사용하지 않는다.
- 개인정보성 입력값을 불필요하게 클라이언트 저장소에 남기지 않는다.
- 결과 URL은 비추측형 문자열이어야 한다.
- raw/normalized/view model 계층을 혼합하지 않는다.
- 운영 환경은 Prisma가 연결된 DB와 일 1회 cleanup job을 지원해야 한다.
- raw debug UI는 `development` + env flag 조건에서만 사용한다.

---

## 11. 디자인 시스템

### 11.1 디자인 방향성

사주TI의 디자인은 아래 네 가지 감각을 동시에 만족해야 한다.

1. **Mystical** - 사주라는 주제 특유의 신비로움
2. **Calm** - 불안하지 않고 안정적인 인상
3. **Readable** - 계산 결과를 읽는 서비스답게 높은 가독성
4. **Modern** - 2026년 기준의 세련된 웹앱 인상

즉, **"미신적인 느낌"보다 "정제된 자기이해 도구"**에 가까워야 한다.

### 11.2 브랜드 키워드

- 달빛
- 오로라
- 유리
- 잉크
- 차분함
- 명료함
- 사색
- 여백

### 11.3 적용 원칙

- 오로라 애니메이션은 **브랜드 장치**이지, 본문 UI가 아니다.
- 본문은 항상 **정적인 카드형 가독성**을 우선한다.
- 장식보다 입력/결과 해독 경험이 우선이다.
- 모바일에서 "예쁘지만 느리고 복잡한 UI"가 되지 않도록 제한한다.

---

## 12. 디자인 토큰

### 12.1 컬러 시스템

#### Light Theme

- `background`: `#F8FAFC`
- `foreground`: `#0F172A`
- `card`: `rgba(255,255,255,0.72)`
- `card-solid`: `#FFFFFF`
- `border`: `rgba(15,23,42,0.08)`
- `muted`: `#64748B`
- `primary`: `#4F46E5`
- `primary-foreground`: `#FFFFFF`
- `secondary`: `#EEF2FF`
- `accent`: `#8B5CF6`
- `accent-soft`: `#EDE9FE`
- `success`: `#16A34A`
- `warning`: `#D97706`
- `danger`: `#DC2626`

#### Dark Theme

- `background`: `#09090B`
- `foreground`: `#F8FAFC`
- `card`: `rgba(24,24,27,0.72)`
- `card-solid`: `#18181B`
- `border`: `rgba(248,250,252,0.08)`
- `muted`: `#A1A1AA`
- `primary`: `#818CF8`
- `primary-foreground`: `#09090B`
- `secondary`: `#1E1B4B`
- `accent`: `#A78BFA`
- `accent-soft`: `#2E1065`
- `success`: `#22C55E`
- `warning`: `#F59E0B`
- `danger`: `#F87171`

### 12.2 의미별 컬러 매핑

- CTA, 주요 선택 상태: `primary`
- 보조 강조: `accent`
- 안내 배지: `secondary`
- 시간 미상 배지: `warning`
- 계산 실패: `danger`
- 성공 상태: `success`

### 12.3 타이포그래피

#### 폰트 우선순위

- 기본: 시스템 산세리프
- Tailwind 기준: `font-sans`
- 한국어 가독성을 우선

#### 텍스트 스케일

- `display`: `text-3xl md:text-5xl font-semibold tracking-tight`
- `h1`: `text-2xl md:text-3xl font-semibold tracking-tight`
- `h2`: `text-xl md:text-2xl font-semibold`
- `h3`: `text-lg md:text-xl font-medium`
- `body-lg`: `text-base md:text-lg leading-7`
- `body`: `text-sm md:text-base leading-6`
- `caption`: `text-xs md:text-sm leading-5 text-muted-foreground`

### 12.4 간격 시스템

- 기준 단위: Tailwind spacing scale
- 모바일 화면 좌우 패딩: `px-4`
- 태블릿 이상: `px-6`
- 주요 섹션 간격: `space-y-6`
- 카드 내부 패딩:
  - 모바일: `p-4`
  - 데스크톱: `p-6`

### 12.5 반경 및 그림자

- `radius-sm`: `rounded-xl`
- `radius-md`: `rounded-2xl`
- `radius-lg`: `rounded-3xl`
- 기본 카드: `rounded-2xl`
- Hero / 강조 박스: `rounded-3xl`

#### 그림자 원칙

- 기본 카드: `shadow-sm`
- 강조 카드: `shadow-md`
- 과도한 네온 글로우 금지
- 아주 은은한 border + backdrop + shadow 조합 선호

### 12.6 모션

- 기본 전환 시간: `200ms ~ 300ms`
- Hero 등장 애니메이션만 framer-motion 사용
- 본문 카드 애니메이션은 최소화
- hover scale은 최대 `1.01`
- 모바일에서는 hover 의존 설계 금지

---

## 13. 레이아웃 시스템

### 13.1 페이지 폭 규칙

- 전체 앱 기본 최대 폭: `max-w-5xl`
- 폼 페이지 최대 폭: `max-w-xl`
- 결과 본문 카드 열: `max-w-3xl`
- 랜딩 Hero 콘텐츠 폭: `max-w-3xl`

### 13.2 모바일 우선 규칙

- 390px 전후 폭에서도 모든 입력이 한 화면 흐름으로 읽혀야 한다.
- 카드 내부에 2열 정보를 넣더라도 모바일에서는 자동으로 1열로 무너져야 한다.
- 결과 카드가 가로 스크롤을 만들면 실패다.

### 13.3 그리드 원칙

#### 랜딩

- 모바일: 1열
- 데스크톱: Hero 아래 설명 카드 2~3열 가능

#### 입력 페이지

- 모바일: 1열
- 데스크톱: 여전히 1열 유지, 폭만 넓힘

#### 결과 페이지

- 모바일: 전체 1열
- 데스크톱: 일부 요약 정보만 2열 가능
- 긴 텍스트 블록은 1열 유지

---

## 14. 핵심 UI 컴포넌트 디자인 명세

### 14.1 `AuroraBackground`

#### 목적

- 랜딩 Hero 및 상단 브랜드 섹션 배경

#### 사용 규칙

- 랜딩 Hero에만 기본 적용
- 결과 페이지 본문 전체에는 사용 금지
- 밝은 배경 위 반투명 오로라가 흐르는 형태
- 텍스트 가독성을 해치지 않도록 오버레이 강도를 조절

#### 수정 방향

- 원본 예시의 전체 화면 강한 효과를 그대로 쓰지 않는다.
- 모바일에서는 blur와 opacity를 약하게 조정한다.
- Hero 내부 콘텐츠는 반드시 별도의 컨테이너에 담아 대비를 확보한다.

### 14.2 `GlassCard`

#### 목적

- Hero 하단 예시 카드 / 일부 강조 블록

#### 스타일

- `rounded-2xl`
- `border border-white/20 dark:border-white/10`
- `bg-white/70 dark:bg-zinc-900/70`
- `backdrop-blur-md`
- `shadow-sm`

#### 주의

- 본문 결과 카드 전체를 모두 glass로 만들면 가독성이 떨어질 수 있으므로, 결과 카드의 다수는 semi-solid card를 사용한다.

### 14.3 `SectionCard`

#### 목적

- 입력 카드, 결과 카드, 목업 리포트 카드

#### 스타일

- `rounded-2xl`
- `bg-white dark:bg-zinc-900`
- `border border-black/5 dark:border-white/10`
- `shadow-sm`
- `p-4 md:p-6`

### 14.4 `PrimaryButton`

#### 목적

- 생성하기
- 다시 해보기
- 시작하기

#### 스타일

- pill형 또는 soft-rounded 버튼
- `h-11 md:h-12`
- `rounded-full`
- `font-medium`
- `bg-primary text-primary-foreground`
- hover 시 밝기만 소폭 조정

### 14.5 `InputField`

#### 스타일

- 충분한 높이
- 모바일 터치 타깃 보장
- `rounded-xl`
- `border`
- `bg-background`
- focus 시 ring 사용
- 에러 시 border + text 색 명확히 구분

### 14.6 `StatusBadge`

#### 종류

- 기본
- 시간 미상
- 성공
- 실패

#### 스타일

- `rounded-full px-3 py-1 text-xs font-medium`
- 정보성 상태만 표현하고 과장된 컬러 금지

### 14.7 `PillarGrid`

#### 목적

- 연/월/일/시 4주 표시

#### 스타일

- 모바일: `2x2 grid` 또는 1열 카드 나열
- 데스크톱: 4열 가능
- 각 pillar를 작은 카드로 구분
- 한자/한글 라벨을 함께 제공 가능

---

## 15. shadcn / Tailwind / TypeScript 적용 원칙

### 15.1 프로젝트 기본 조건

코드베이스는 아래를 지원해야 한다.

- shadcn/ui 기반 컴포넌트 재사용
- Tailwind CSS
- TypeScript

---

## 16. 오로라 배경 컴포넌트 구현 지침

### 16.1 구현 목표

사용자가 제공한 오로라 레퍼런스를 그대로 복붙하는 것이 아니라, 사주TI의 브랜드 인상과 모바일 성능에 맞게 다듬는다.

### 16.2 수정 정책

- 높이를 `100vh`로 고정하지 않는다.
- Hero section 용도로 `min-h-[70vh]` 또는 콘텐츠 기준 자동 높이 사용
- 모바일에서 blur 강도와 opacity를 낮춘다
- 배경 효과와 텍스트 사이에 반투명 content wrapper를 둔다
- radial mask를 유지하되 과도한 contrast는 줄인다

### 16.3 참고 구현 예시: `AuroraBackground`

아래 코드는 참고용 예시다. 동일한 시각적 역할과 가독성/성능 기준을 만족한다면 다른 파일 위치나 구현 방식으로 대체해도 된다.

```tsx
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface AuroraBackgroundProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  showRadialGradient?: boolean;
}

export function AuroraBackground({
  className,
  children,
  showRadialGradient = true,
  ...props
}: AuroraBackgroundProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden bg-zinc-50 text-slate-950 dark:bg-zinc-950 dark:text-white",
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className={cn(
            `
            absolute inset-0 opacity-40 md:opacity-50
            [--white-gradient:repeating-linear-gradient(100deg,var(--white)_0%,var(--white)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--white)_16%)]
            [--dark-gradient:repeating-linear-gradient(100deg,var(--black)_0%,var(--black)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--black)_16%)]
            [--aurora:repeating-linear-gradient(100deg,var(--blue-500)_10%,var(--indigo-300)_18%,var(--violet-300)_26%,var(--sky-300)_34%,var(--blue-400)_42%)]
            [background-image:var(--white-gradient),var(--aurora)]
            dark:[background-image:var(--dark-gradient),var(--aurora)]
            [background-size:300%,_200%]
            [background-position:50%_50%,50%_50%]
            filter blur-[12px] md:blur-[16px] invert dark:invert-0
            after:content-[""] after:absolute after:inset-0
            after:[background-image:var(--white-gradient),var(--aurora)]
            after:dark:[background-image:var(--dark-gradient),var(--aurora)]
            after:[background-size:200%,_100%]
            after:animate-aurora after:[background-attachment:fixed]
            after:mix-blend-difference
            `,
            showRadialGradient &&
              "[mask-image:radial-gradient(ellipse_at_100%_0%,black_12%,transparent_72%)]"
          )}
        />
        <div className="absolute inset-0 bg-white/30 dark:bg-black/20" />
      </div>

      <div className="relative z-10">{children}</div>
    </section>
  );
}
```

### 16.4 참고 구현 예시: Hero wrapper

아래 코드는 참고용 예시다. 실제 Hero 구성은 프로젝트 구조와 컴포넌트 체계에 맞게 조정할 수 있다.

```tsx
"use client";

import { motion } from "framer-motion";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { Button } from "@/components/ui/button";

export function LandingHero() {
  return (
    <AuroraBackground className="min-h-[72vh]">
      <div className="mx-auto flex min-h-[72vh] max-w-3xl items-center px-4 py-16 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="w-full rounded-3xl border border-white/30 bg-white/65 p-6 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-zinc-900/60 md:p-10"
        >
          <div className="mb-3 inline-flex rounded-full border border-black/5 bg-white/70 px-3 py-1 text-xs text-slate-600 dark:border-white/10 dark:bg-zinc-900/70 dark:text-zinc-300">
            사주 × MBTI 결과 서비스
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white md:text-5xl">
            당신의 사주를, 더 읽기 쉬운 구조로
          </h1>
          <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-zinc-300 md:text-base md:leading-7">
            이름, 생년월일시, MBTI를 입력하면 사주 계산 결과를 구조화해 보여드립니다.
            지금은 계산 기반 목업 리포트를 우선 제공합니다.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" className="rounded-full">
              사주 결과 보기
            </Button>
          </div>
        </motion.div>
      </div>
    </AuroraBackground>
  );
}
```

---

## 17. Tailwind 설정 확장 지침

### 17.1 목적

오로라 배경 애니메이션과 색상 CSS 변수를 지원한다.

### 17.2 참고 설정 예시: `tailwind.config.ts`

아래 설정은 참고용 예시다. 프로젝트의 Tailwind 버전, 기존 설정, 플러그인 정책에 맞게 다른 방식으로 구성해도 된다.

```ts
import type { Config } from "tailwindcss";
import flattenColorPalette from "tailwindcss/lib/util/flattenColorPalette";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        aurora: "aurora 60s linear infinite",
      },
      keyframes: {
        aurora: {
          from: {
            backgroundPosition: "50% 50%, 50% 50%",
          },
          to: {
            backgroundPosition: "350% 50%, 350% 50%",
          },
        },
      },
    },
  },
  plugins: [addVariablesForColors],
};

function addVariablesForColors({
  addBase,
  theme,
}: {
  addBase: (base: Record<string, Record<string, string>>) => void;
  theme: (path: string) => unknown;
}) {
  const allColors = flattenColorPalette(theme("colors") as Record<string, string>);
  const newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, String(val)])
  );

  addBase({
    ":root": newVars,
  });
}

export default config;
```

### 17.3 참고 설정 예시: `globals.css` 토큰

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 248 250 252;
    --foreground: 15 23 42;

    --card: 255 255 255;
    --card-foreground: 15 23 42;

    --popover: 255 255 255;
    --popover-foreground: 15 23 42;

    --primary: 79 70 229;
    --primary-foreground: 255 255 255;

    --secondary: 238 242 255;
    --secondary-foreground: 49 46 129;

    --muted: 241 245 249;
    --muted-foreground: 100 116 139;

    --accent: 237 233 254;
    --accent-foreground: 76 29 149;

    --destructive: 220 38 38;
    --destructive-foreground: 255 255 255;

    --border: 226 232 240;
    --input: 226 232 240;
    --ring: 99 102 241;

    --radius: 1rem;
  }

  .dark {
    --background: 9 9 11;
    --foreground: 248 250 252;

    --card: 24 24 27;
    --card-foreground: 248 250 252;

    --popover: 24 24 27;
    --popover-foreground: 248 250 252;

    --primary: 129 140 248;
    --primary-foreground: 9 9 11;

    --secondary: 30 27 75;
    --secondary-foreground: 224 231 255;

    --muted: 39 39 42;
    --muted-foreground: 161 161 170;

    --accent: 46 16 101;
    --accent-foreground: 233 213 255;

    --destructive: 248 113 113;
    --destructive-foreground: 9 9 11;

    --border: 39 39 42;
    --input: 39 39 42;
    --ring: 129 140 248;
  }

  * {
    @apply border-border;
  }

  body {
    @apply bg-background text-foreground antialiased;
  }
}
```

---

## 18. shadcn 컴포넌트 운영 원칙

### 18.1 반드시 둘 기본 컴포넌트

- `button`
- `input`
- `label`
- `card`
- `badge`
- `select`
- `separator`
- `skeleton`
- `textarea` (후속 확장 대비)
- `alert`

### 18.2 스타일 수정 원칙

- shadcn 기본을 유지하되, radius와 color token만 브랜드 방향에 맞게 조정
- 컴포넌트마다 새로운 스타일 체계를 만들지 않는다
- 공통 스타일은 variants 또는 wrapper 컴포넌트로 흡수한다

### 18.3 아이콘

- `lucide-react`만 사용
- 입력/결과 설명용 아이콘은 과하게 쓰지 않는다

추천 아이콘 예시:

- `Calendar`
- `Sparkles`
- `MoonStar`
- `BadgeInfo`
- `Hourglass`
- `ArrowRight`

---

## 19. 권장 아키텍처

### 19.1 아키텍처 개요

- **UI Layer**: 페이지 및 프레젠테이션 컴포넌트
- **Application Layer**:
  - report creation use case
  - report retrieval use case
- **Domain Layer**:
  - validation
  - calculation
  - normalization
  - mock report builder
  - view model builder
- **Persistence Layer**: Prisma 기반 저장/조회

### 19.2 데이터 흐름

1. 사용자가 폼을 제출한다.
2. 클라이언트가 report creation entrypoint로 요청을 보낸다. (기본 구현: `POST /api/report`)
3. 서버 entrypoint가 입력값을 `ReportCreateInput`으로 변환하고 Zod로 검증한다.
4. `missingTime`를 계산한다.
5. 요청 원본을 저장한다.
6. 계산 엔진 어댑터를 호출한다.
7. raw output을 받는다.
8. raw output을 normalized output으로 변환한다.
9. normalized output을 기반으로 mock report를 생성한다.
10. `publicId`를 포함한 결과를 저장한다.
11. entrypoint가 `publicId`와 처리 결과를 응답한다.
12. 클라이언트가 `/report/[publicId]`로 이동한다.
13. 결과 페이지에서 저장된 데이터를 읽어 view model로 렌더링한다.

### 19.3 클라이언트/서버 책임 분리

#### 클라이언트

- 폼 입력
- 기본 UX 상태 관리
- 필드 오류 표시
- 결과 렌더링

#### 서버

- 입력 검증
- 사주 계산
- 결과 정규화
- 결과 저장
- 결과 조회
- 에러 분류 및 기록

### 19.4 모듈 경계 원칙

- 계산 엔진 출력 형식은 engine adapter 내부에 가둔다.
- UI는 raw output을 몰라야 한다.
- UI는 오직 view model만 받아 사용한다.
- 향후 LLM 기능은 report generation layer만 추가하면 되도록 설계한다.

---

## 20. 권장 폴더 구조

아래 구조와 파일명은 권장 예시다. 기존 프로젝트 구조가 있거나 더 단순한 구성이 적합하다면, 책임 분리와 데이터 흐름 원칙을 유지하는 범위에서 수정 가능하다.

```text
src/
  app/
    page.tsx
    api/
      report/
        route.ts
    report/
      new/
        page.tsx
      [id]/
        page.tsx
        not-found.tsx
  components/
    ui/
      aurora-background.tsx
      button.tsx
      input.tsx
      label.tsx
      card.tsx
      badge.tsx
      select.tsx
      skeleton.tsx
      alert.tsx
    common/
      page-container.tsx
      section-card.tsx
      status-badge.tsx
      loading-state.tsx
      error-state.tsx
      empty-state.tsx
    marketing/
      landing-hero.tsx
      feature-cards.tsx
    report-form/
      report-form.tsx
      name-field.tsx
      sex-field.tsx
      birth-date-field.tsx
      birth-time-field.tsx
      mbti-field.tsx
      submit-button.tsx
    report-view/
      report-header.tsx
      input-summary-card.tsx
      pillars-card.tsx
      day-master-card.tsx
      five-elements-card.tsx
      daewoon-card.tsx
      mbti-card.tsx
      mock-report-card.tsx
  lib/
    validation/
      report-request.schema.ts
    saju/
      engine/
        orrery.adapter.ts
      calculate.ts
      normalize.ts
      types.ts
    report/
      create-report.ts
      get-report-by-public-id.ts
      build-mock-report.ts
      build-view-model.ts
      delete-expired-reports.ts
    db/
      client.ts
      report.repository.ts
    utils/
      date.ts
      errors.ts
      serialize.ts
  prisma/
    schema.prisma
  scripts/
    cleanup-expired-reports.ts
  tests/
    unit/
    integration/
    e2e/
```

---

## 21. 데이터 계약

### 21.1 입력 스키마

- `birthDate`는 `YYYY-MM-DD` 형식의 문자열이다.
- `birthHour`, `birthMinute`는 `Asia/Seoul` 기준 로컬 출생 시각이다.

```ts
export type SexForCalculation = "male" | "female";

export type MBTIType =
  | "INTJ" | "INTP" | "ENTJ" | "ENTP"
  | "INFJ" | "INFP" | "ENFJ" | "ENFP"
  | "ISTJ" | "ISFJ" | "ESTJ" | "ESFJ"
  | "ISTP" | "ISFP" | "ESTP" | "ESFP";

export interface ReportCreateInput {
  name: string;
  sexForCalculation: SexForCalculation;
  birthDate: string;
  birthHour?: number | null;
  birthMinute?: number | null;
  mbti: MBTIType;
  timezone: string;
}
```

### 21.2 정규화 결과 스키마

```ts
export interface Pillar {
  heavenlyStem: string;
  earthlyBranch: string;
  label?: string;
}

export type FiveElementKey = "wood" | "fire" | "earth" | "metal" | "water";

export interface FiveElementSummary {
  element: FiveElementKey;
  value: number;
}

export interface DaewoonItem {
  order: number;
  label: string;
  startAge?: number | null;
  startYear?: number | null;
  isCurrent?: boolean;
}

export interface NormalizedSajuResult {
  pillars: {
    year: Pillar | null;
    month: Pillar | null;
    day: Pillar | null;
    hour: Pillar | null;
  };
  dayMaster: string | null;
  fiveElements: FiveElementSummary[];
  keyRelations: string[];
  daewoon: DaewoonItem[];
  missingTime: boolean;
}
```

### 21.3 목업 리포트 스키마

```ts
export interface MockReportBlock {
  key:
    | "overview"
    | "dayMaster"
    | "fiveElements"
    | "daewoon"
    | "mbti"
    | "missingTime";
  title: string;
  body: string;
}
```

### 21.4 저장 레코드 스키마

```ts
export type CalculationStatus = "success" | "failed";

export interface ReportRecord {
  requestId: string;
  resultId: string;
  publicId: string;
  input: ReportCreateInput;
  calculationStatus: CalculationStatus;
  missingTime: boolean;
  engineName: string;
  rawEngineOutput: string | null;
  normalizedOutput: string | null;
  mockReport: string | null;
  errorMessage: string | null;
  createdAt: string;
  updatedAt: string;
}
```

### 21.5 결과 페이지 View Model

```ts
export interface ReportPageViewModel {
  reportPublicId: string;
  title: string;
  createdAtLabel: string;
  missingTime: boolean;
  inputSummary: {
    name: string; // masked display name
    sexForCalculation: string;
    birthDate: string;
    birthTimeLabel: string;
    mbti: string;
  };
  pillars: {
    year: string | null;
    month: string | null;
    day: string | null;
    hour: string | null;
  };
  dayMaster: string | null;
  fiveElements: {
    element: string;
    value: number;
    label: string;
  }[];
  daewoon: {
    order: number;
    label: string;
    startAge?: number | null;
    isCurrent?: boolean;
  }[];
  mockReport: MockReportBlock[];
  status: "success" | "failed";
  errorMessage?: string | null;
}
```

---

## 22. DB 스키마 초안

### 22.1 설계 원칙

- 입력 원본과 계산 결과를 분리한다.
- 공개 조회용 `publicId`와 내부 식별자를 분리한다.
- raw output과 normalized output을 모두 보존한다.
- SQLite와 PostgreSQL 간 이식성을 위해 JSON payload는 MVP에서 문자열 직렬화 저장을 허용한다.
- 결과 조회는 request → result `1:1` 관계를 기본으로 한다.

### 22.2 Prisma 스키마 예시

```prisma
model ReportRequest {
  id                String       @id @default(cuid())
  name              String
  sexForCalculation String
  birthDate         String
  birthHour         Int?
  birthMinute       Int?
  mbti              String
  timezone          String       @default("Asia/Seoul")
  missingTime       Boolean
  createdAt         DateTime     @default(now())
  result            ReportResult?
}

model ReportResult {
  id                String    @id @default(cuid())
  publicId          String    @unique @default(cuid())
  requestId         String    @unique
  calculationStatus String
  engineName        String
  rawEngineOutput   String?
  normalizedOutput  String?
  mockReport        String?
  errorMessage      String?
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt

  request ReportRequest @relation(fields: [requestId], references: [id], onDelete: Cascade)
}
```

---

## 23. 서버 로직 명세

### 23.1 생성 방식

**기본 권장 방식**: **API Route** (`app/api/report/route.ts` POST)

이유:
- validation 실패 → 필드 오류를 포함한 구조화된 응답 반환 → 클라이언트에서 입력값 유지 & 필드 에러 표시 매우 용이
- calculation 완료 후에는 success / failed를 동일한 완료 응답 계약으로 다룰 수 있다
- 실패 상태와 success 상태 모두 동일한 결과 라우트로 수렴시키기 쉽고 디버깅이 명확하다

구현 원칙:
- 기존 프로젝트 구조상 다른 서버 진입점이 더 자연스럽다면 대체할 수 있다. 단, 아래의 입력 검증/응답 계약/결과 라우팅 규칙은 동일하게 유지한다.
- validation 실패 시 입력 페이지에 머무르며 필드 오류 응답을 반환한다.
- calculation이 시작된 뒤에는 success / failed 모두 `publicId`를 기준으로 결과 페이지에서 렌더링한다.
- 클라이언트는 완료 응답을 해석해 `/report/[publicId]`로 이동한다.

권장 응답 계약:

```ts
type ReportCreationValidationError = {
  type: "validation_error";
  errors: Record<string, string>;
};

type ReportCreationCompleted = {
  type: "completed";
  publicId: string;
  status: "success" | "failed";
  errorMessage?: string | null;
};
```

### 23.2 핵심 서버 함수

#### report creation entrypoint (default: `POST /api/report`)

역할:

- request body parse
- validation error 응답 작성
- `createReport(input)` 호출
- 완료 응답 반환

#### `createReport(input)`

역할:

- request 저장
- 계산 수행
- normalize 수행
- mock report 생성
- result 저장
- `{ publicId, status, errorMessage? }` 반환

#### `calculateSaju(input)`

역할:

- 어댑터를 통해 사주 라이브러리 호출
- raw engine output 반환

#### `normalizeSaju(raw, context)`

역할:

- raw output을 내부 표준 형태로 변환

#### `buildMockReport(normalized, input)`

역할:

- 규칙형 설명 블록 생성

#### `getReportByPublicId(publicId)`

역할:

- `publicId` 기준 request/result 조회
- 결과 없으면 not found
- 결과 있으면 view model 생성

#### `buildReportPageViewModel(record)`

역할:

- DB 저장 구조를 UI 렌더링 구조로 변환

### 23.3 생성 처리 순서

1. 클라이언트가 report creation entrypoint로 요청을 보낸다. (기본 구현: `POST /api/report`)
2. request body를 `ReportCreateInput`으로 변환한다
3. Zod 검증
4. validation 실패 시 필드 오류 응답을 반환하고 입력 페이지에 머문다
5. `missingTime` 계산
6. ReportRequest 저장
7. 결과 레코드용 `publicId`를 준비한다
8. 계산 시도
9. 성공 시:
   - raw 저장
   - normalized 저장
   - mock report 저장
   - `status = success`
10. 실패 시:
   - `status = failed`
   - error message 저장
11. 완료 응답으로 `publicId`, `status`, `errorMessage?`를 반환한다
12. 클라이언트는 success / failed 모두 `/report/[publicId]`로 이동한다

### 23.4 실패 정책

#### validation 실패

- 폼에 필드 오류 반환
- DB 저장 안 함

#### calculation 실패

- request는 저장
- result는 failed 상태 저장
- `/report/[publicId]` failed 페이지로 이동
- 결과 페이지에서 재시도 CTA 제공

#### unexpected error

- 공통 에러로 분류
- 사용자에게는 일반 메시지 제공
- 서버에는 디버깅 가능한 로그 남김

### 23.5 만료 데이터 cleanup 정책

- 결과 보존 기간은 생성 시점 기준 30일이다.
- `deleteExpiredReports(cutoffDate)` use case를 구현한다.
- `scripts/cleanup-expired-reports.ts`로 일 1회 실행 가능한 형태를 제공한다.
- 운영 환경은 스케줄러에서 위 cleanup을 호출할 수 있어야 한다.

---

## 24. 사주 계산 및 정규화 로직 명세

### 24.1 계산 계층 요구사항

- 계산 엔진 직접 호출은 오직 engine adapter만 수행한다.
- 애플리케이션 나머지 계층은 엔진의 raw shape를 몰라야 한다.
- 엔진 교체 가능성을 고려해 adapter 인터페이스를 둔다.

### 24.2 정규화 계층 목적

라이브러리마다 결과 구조가 다르므로, UI와 저장 계층이 흔들리지 않도록 앱 내부 표준 스키마로 정규화한다.

### 24.3 정규화 원칙

- UI가 쓰는 필드만 추출
- 누락 가능 필드는 null 허용
- 배열/객체 구조를 명시적으로 통일
- raw 필드명을 프론트까지 전파하지 않음
- `missingTime`는 normalized 결과에도 반영

### 24.4 시간 미상 처리 규칙

- 출생 시 미입력 → `missingTime = true`
- 출생 시 미입력 상태에서는 `hour pillar = null`
- 출생 분만 단독 입력은 validation error
- 출생 시 입력, 분 미입력 → 분을 `00`으로 보정하고 `missingTime = false`

### 24.5 계산 엔진 채택 게이트

- `orrery` 채택은 기본 가정이지만, 본 구현 착수 전 **1일 스파이크**로 아래를 검증해야 한다.
- 검증 항목:
  - 서비스 포함 가능 라이선스인지
  - Node.js server runtime에서 안정적으로 동작하는지
  - `Asia/Seoul` 기준 샘플 케이스 계산이 가능한지
  - 출생 시간 미상 케이스에서 `hour pillar = null` 정책을 수용 가능한지
  - 샘플 5건 이상에서 raw output을 안정적으로 획득 가능한지
- 위 조건 중 하나라도 충족하지 못하면, Phase 5 이전에 엔진을 교체하고 adapter 인터페이스는 유지한다.

---

## 25. 목업 리포트 명세

### 25.1 목적

LLM 없이도 결과 페이지에 기본 설명 경험을 제공한다.

### 25.2 생성 방식

규칙형 문자열 조합 방식으로 생성한다. 완전 자유서술은 금지한다.

### 25.3 최소 블록 구성

- 한눈에 보기
- 일간 설명
- 오행 분포 설명
- 대운 안내
- MBTI 메모
- 시간 미상 안내(조건부)

### 25.4 문장 정책

- 명확하고 짧게
- 단정적 예언 금지
- 불안 유발 금지
- 건강/사망/재난/투자 판단 금지
- MBTI는 이번 단계에서 표시용 + 향후 확장용 데이터로 다룬다

### 25.5 예시 수준

- 당신의 일간은 `{dayMaster}`입니다.
- 오행 분포에서는 `{topElementLabel}` 기운이 상대적으로 두드러집니다.
- 현재 버전에서는 계산 결과를 중심으로 기본 정보를 구조화해 보여줍니다.
- MBTI는 저장 및 표시되며, 해석 연결은 추후 버전에서 확장됩니다.
- 출생 시간이 없어 시주 관련 해석은 제한될 수 있습니다.

---

## 26. UI 컴포넌트 명세

### 26.1 공통 컴포넌트

- `PageContainer`
- `SectionCard`
- `StatusBadge`
- `LoadingState`
- `ErrorState`
- `EmptyState`

### 26.2 입력 페이지 컴포넌트

- `ReportForm`
- `NameField`
- `SexField`
- `BirthDateField`
- `BirthTimeField`
- `MbtiField`
- `SubmitButton`

### 26.3 결과 페이지 컴포넌트

- `ReportHeader`
- `InputSummaryCard`
- `PillarsCard`
- `DayMasterCard`
- `FiveElementsCard`
- `DaewoonCard`
- `MbtiCard`
- `MockReportCard`

### 26.4 UI 설계 원칙

- 모바일 우선
- 한 화면에 너무 많은 정보를 압축하지 않음
- 카드 단위로 의미를 분리
- 값과 설명을 함께 보여줌
- 보기 어려운 한자/용어만 던지지 않고 레이블을 제공

---

## 27. 상태 관리 원칙

### 27.1 클라이언트 상태

- 폼 입력값
- 제출 pending 상태
- 필드 에러
- 서버 에러

### 27.2 서버 상태

- report 생성 성공/실패
- 결과 조회 성공/실패/not found

### 27.3 전역 상태

- MVP에서는 전역 상태 라이브러리 사용 금지
- React 기본 상태 + 서버 데이터만 사용

### 27.4 페이지 상태 모델

#### 입력 페이지

- `idle`
- `invalid`
- `submitting`
- `submit_failed`

#### 결과 페이지

- `loading`
- `success`
- `failed`
- `not_found`

---

## 28. 에러 및 예외 처리

### 28.1 에러 코드 체계

- `VALIDATION_ERROR`
- `CALCULATION_ERROR`
- `NOT_FOUND`
- `UNKNOWN_ERROR`

### 28.2 사용자 노출 에러 메시지 예시

- 이름을 입력해 주세요.
- 유효한 생년월일을 입력해 주세요.
- MBTI를 선택해 주세요.
- 출생 분만 단독으로 입력할 수 없습니다.
- 결과 생성 중 오류가 발생했습니다. 다시 시도해 주세요.
- 요청하신 결과를 찾을 수 없습니다.

### 28.3 에러 처리 정책

- 필드 단위로 해결 가능한 에러는 필드 아래에 표시
- 계산 실패는 failed 결과 페이지의 일반 오류 카드로 노출
- 존재하지 않는 결과는 not-found 화면으로 분기
- 민감한 내부 에러 스택은 사용자에게 노출하지 않음

### 28.4 로그 정책

- 서버 로그에는 에러 원인을 남긴다.
- 생년월일 전체, 이름 등 개인정보는 필요 최소 수준으로만 로깅한다.
- raw engine output 전체를 무분별하게 로그로 남기지 않는다.

---

## 29. 접근성 / 반응형 요구사항

### 29.1 접근성

- 모든 입력 필드에 label 연결
- 필드 오류는 스크린리더가 인지 가능해야 함
- 포커스 이동이 자연스러워야 함
- 키보드만으로 폼 제출 가능해야 함
- 컬러만으로 상태를 구분하지 않는다
- badge와 error는 아이콘 또는 텍스트도 함께 제공한다

### 29.2 반응형

- 기본 기준은 모바일 우선
- 데스크톱에서는 중앙 정렬, 최대 폭 제한
- 결과 카드는 기본 1열
- 넓은 화면에서만 일부 2열 배치 허용
- 320px 폭에서도 폼이 깨지지 않아야 함
- Hero 버튼은 모바일에서 full-width 허용

---

## 30. 보안 / 개인정보 요구사항

### 30.1 개인정보 처리 원칙

- 이름, 생년월일, 출생시간은 개인정보성 정보로 취급한다.
- 클라이언트 로컬스토리지에 저장하지 않는다.
- 결과 페이지는 `noindex`, `nofollow`, `noarchive` 처리한다.
- 결과 페이지의 이름 표시는 기본적으로 마스킹된 표시값을 사용한다.

### 30.2 URL 안전성

- `/report/[id]`의 `id`는 `ReportResult.publicId`다.
- `publicId`는 내부 `id`, `requestId`와 분리된 비연속형 문자열을 사용한다.
- 추측 가능한 숫자 증가 ID 사용 금지

### 30.3 저장 정책

- MVP에서는 결과 저장이 필요하므로 DB 저장을 허용한다.
- 결과 보존 기간은 생성 후 30일이다.
- 운영 환경에서는 일 1회 cleanup job으로 만료 결과를 자동 삭제한다.
- 사용자 직접 삭제 UI는 MVP 범위에서 제외한다.

### 30.4 보안 기본 원칙

- 서버 계산 로직을 클라이언트에 노출하지 않는다.
- 환경변수 및 비공개 설정은 서버에만 둔다.
- raw 출력은 UI 기본 노출 금지
- 입력 페이지에 `결과 URL을 아는 사람은 열람 가능` 고지를 명시한다.

---

## 31. 성능 요구사항

### 31.1 목표

- 유효한 제출 후 결과 페이지 redirect 시작까지 `p95 5초 이하`를 목표로 한다. (cold start 제외)
- 저장된 결과 조회 응답은 `p95 1.5초 이하`를 목표로 한다. (cold start 제외)
- 대기 중에는 명확한 loading UI 제공
- 결과 조회 페이지는 불필요한 클라이언트 의존 없이 안정적으로 렌더링할 것

### 31.2 구현 지침

- 결과 페이지는 서버 데이터 기반 렌더링 우선
- 계산 로직은 서버에서 실행
- 무거운 시각화는 도입하지 않음
- 오행 분포는 단순 수치 및 바 그래프 수준으로 제한
- 오로라 배경 애니메이션은 Hero 1개 영역에만 적용

---

## 32. 테스트 요구사항

### 32.1 테스트 도구

- Unit / Integration: Vitest
- Component: React Testing Library
- E2E: Playwright

### 32.2 단위 테스트 대상

- Zod 입력 검증 스키마
- 시간 미상 판단 로직
- normalize 함수
- mock report 생성 함수
- view model 생성 함수

### 32.3 통합 테스트 대상

- report creation entrypoint 성공 플로우 (기본 구현: `POST /api/report`)
- report creation entrypoint validation 실패 플로우 (기본 구현: `POST /api/report`)
- report creation entrypoint failed 완료 응답 플로우 (기본 구현: `POST /api/report`)
- `publicId` 기반 result 조회 플로우
- cleanup use case 플로우
- not found 플로우

### 32.4 E2E 테스트 대상

- 랜딩 → 입력 → 제출 → 결과 성공
- 시간 미상 입력 → 결과 성공
- 잘못된 입력 → 오류 표시
- 계산 실패 → failed 결과 페이지 표시
- 존재하지 않는 결과 URL → not found

### 32.5 테스트 우선순위

- validation schema
- normalize
- `createReport`
- report creation entrypoint
- 결과 페이지 렌더링
- E2E happy path
- Hero 및 핵심 버튼의 모바일 레이아웃 스모크 테스트

---

## 33. Acceptance Criteria

### AC-1 입력 폼

- 사용자는 이름, 성별(계산용), 생년월일, MBTI를 입력해야 제출할 수 있다.
- 출생 시간은 비워둘 수 있다.
- 출생 분만 입력하면 오류가 발생한다.

### AC-2 계산 실행

- 유효한 입력 제출 시 서버에서 사주 계산이 실행된다.
- 계산 성공 시 결과가 저장된다.
- 결과 생성 후 `publicId` 기반 결과 페이지로 이동한다.

### AC-3 결과 저장

- 입력 원본과 결과가 분리 저장된다.
- 결과 조회용 `publicId`가 별도로 발급된다.
- raw/normalized/mock report가 모두 저장된다.
- 실패 시에도 상태와 오류 메시지를 저장할 수 있다.
- 30일이 지난 결과는 cleanup 대상이 된다.

### AC-4 결과 페이지

- 결과 페이지에는 입력 요약, 사주 결과, 일간, 오행 분포, 대운, MBTI, 목업 리포트가 표시된다.

### AC-5 시간 미상

- 출생 시간을 비워도 결과를 만들 수 있다.
- 결과 페이지에 시간 미상 안내가 표시된다.
- 시주 정보는 `null` 또는 안내 문구로 처리된다.

### AC-6 오류 처리

- 잘못된 입력은 필드 수준으로 오류를 보여준다.
- 계산 실패는 failed 결과 페이지에서 일반 에러 카드와 재시도 동선을 제공한다.
- 없는 ID 접근 시 not found를 보여준다.

### AC-7 디자인 시스템

- 랜딩 Hero에 AuroraBackground가 적용된다.
- 입력/결과 페이지에는 카드형 UI가 일관되게 적용된다.
- 모바일에서 1열 레이아웃이 유지된다.
- CTA, 상태 배지, 카드, 입력 필드 스타일이 일관된다.

### AC-8 테스트

- 핵심 도메인 함수 테스트가 통과한다.
- happy path E2E 테스트가 통과한다.

---

## 34. 구현 순서 제안

### Phase 0 - 계산 엔진 검증

- `orrery` 라이선스/런타임/샘플 출력 검증
- 실패 시 대체 엔진 선정
- adapter 인터페이스 고정

### Phase 1 - 프로젝트 베이스 세팅

- Next.js + TypeScript 프로젝트 생성
- Tailwind CSS 설정
- shadcn/ui 초기화
- Prisma 설정
- SQLite 연결
- 기본 라우트 생성

### Phase 2 - 디자인 토큰 및 공통 UI

- `globals.css` 토큰 설정
- `tailwind.config.ts` 애니메이션/변수 플러그인 설정
- `button`, `input`, `card`, `badge` 등 shadcn 컴포넌트 초기화
- `AuroraBackground`, `SectionCard`, `StatusBadge` 작성

### Phase 3 - 도메인 타입과 스키마

- MBTI enum 정의
- 입력 스키마 정의
- normalized 타입 정의
- mock report 타입 정의
- 에러 타입 정의

### Phase 4 - 폼 및 검증

- 입력 페이지 UI 구현
- 클라이언트/서버 검증 연결
- 제출 상태 UX 구현

### Phase 5 - 계산 어댑터 및 정규화

- `orrery` adapter 작성
- calculate 함수 작성
- normalize 함수 작성
- 시간 미상 처리 구현

### Phase 6 - 저장 계층

- Prisma 모델 작성
- `publicId` 필드 추가
- repository 함수 작성
- request/result 저장 플로우 작성
- 만료 결과 cleanup use case 작성

### Phase 7 - 생성 API

- `createReport` 구현
- 기본 구현 선택 시 `POST /api/report` route handler 구현
- 성공/실패 JSON 응답 작성
- 클라이언트 redirect 연결

### Phase 8 - 결과 페이지

- 조회 로직 작성
- view model builder 작성
- 결과 카드 컴포넌트 구현
- not found / failed 상태 처리

### Phase 9 - 목업 리포트

- 규칙형 리포트 생성 함수 작성
- 결과 페이지에 연결

### Phase 10 - 테스트 및 안정화

- 단위 테스트
- 통합 테스트
- E2E happy path
- cleanup 실행 경로 점검
- 모바일 레이아웃 점검
- 에러/문구/상태 보정

---

## 35. Claude Code용 구현 가드레일

- 이번 단계에는 LLM 코드를 넣지 않는다.
- 사주 계산은 반드시 서버에서만 실행한다.
- 계산 및 DB 로직에 Edge runtime을 사용하지 않는다.
- raw output과 normalized output을 혼합하지 않는다.
- UI는 raw output에 직접 의존하지 않는다.
- 결과 페이지는 view model을 통해서만 렌더링한다.
- 개인정보를 클라이언트 저장소에 보존하지 않는다.
- 공개 라우트는 내부 ID가 아닌 `publicId`만 사용한다.
- 상태 관리 라이브러리를 새로 도입하지 않는다.
- 계산 라이브러리와 앱 로직은 adapter 계층으로 분리한다.
- 계산 결과가 불완전해도 normalized 계층에서 null-safe 하게 처리한다.
- 우선 "동작하는 최소 제품"을 만든 뒤 스타일을 다듬는다.
- 실패 상태와 not found 상태를 happy path만큼 중요하게 구현한다.
- 목업 리포트는 규칙형 문자열 조합으로만 만든다.
- 오로라 배경은 Hero에만 사용하고 본문 UI는 가독성 중심으로 유지한다.
- `lucide-react` 외의 아이콘/에셋 의존성은 최소화한다.
- 임의의 Unsplash 이미지 주입은 하지 않는다. 이번 서비스 MVP에는 필수 이미지 자산이 없다.
- 사용자 다크모드 토글 UI는 이번 단계에 넣지 않는다.

---

## 36. 후속 검토 항목

- 성별(계산용) 2값 정책을 장기적으로 어떻게 확장할지
- 음력/윤달을 언제 지원할지
- 사용자 직접 결과 삭제 기능을 넣을지
- 오행 분포 수치 표시 방식을 텍스트 중심으로 둘지, 간단 차트를 추가할지
- 다크모드 완성도와 토글 UX를 후속 버전에서 얼마나 확장할지

---

## 37. 완료 정의 (Definition of Done)

아래 조건을 모두 만족하면 이번 MVP 개발 완료로 본다.

- 로컬에서 앱이 정상 실행된다.
- 랜딩 → 입력 → 생성 → 결과 조회가 동작한다.
- 결과 조회가 `publicId` 기반 라우트로 동작한다.
- 출생 시간 미상 케이스가 동작한다.
- request/result가 DB에 저장된다.
- raw/normalized/mock report가 분리 저장된다.
- 30일 보존 정책을 위한 cleanup use case와 실행 경로가 준비된다.
- 결과 페이지가 필수 카드 구성을 모두 렌더링한다.
- 잘못된 입력과 계산 실패, 결과 없음 상태가 처리된다.
- 핵심 단위 테스트가 통과한다.
- 최소 1개의 happy path E2E가 통과한다.
- 모바일에서 레이아웃이 깨지지 않는다.
- 랜딩 Hero에 브랜드형 AuroraBackground가 적용된다.
- 향후 LLM 확장을 가로막는 구조적 결함이 없다.

---

## 38. 추후 확장 예정 항목

이번 문서 범위에는 포함하지 않지만, 구조상 대비해야 하는 항목이다.

- LLM 기반 자연어 해석 리포트
- MBTI × 사주 연계 해석
- 자유 질문 / 추천 질문
- 결과 히스토리
- 궁합 분석
- 연애운 / 직업운 / 재물운 심화 리포트
- 유료 기능
- 계정 기반 개인 대시보드
- 다크모드 완성도 고도화
- 공유용 결과 카드

---

## 39. Claude Code 실행용 요약

- Next.js App Router + TypeScript + Tailwind + shadcn/ui + Prisma + SQLite로 MVP를 구성한다.
- 페이지는 `/`, `/report/new`, `/report/[id]` 세 개로 시작한다.
- `/report/[id]`의 `id`는 공개 조회용 `publicId`다.
- 입력값은 이름, 성별(계산용), 생년월일, 출생 시/분, MBTI다.
- 제출은 report creation entrypoint를 통해 처리하고, 기본 구현은 API Route (`POST /api/report`)를 권장한다.
- validation 실패 응답과 완료 응답의 계약은 문서 명세를 유지한다.
- 사주 계산은 서버 전용 adapter를 통해 수행한다.
- raw output은 normalize 계층에서 내부 표준 스키마로 변환한다.
- request/result를 분리 저장하고, raw/normalized/mock report를 모두 보존한다.
- validation 실패는 입력 페이지에 머무르고, 계산이 시작된 뒤에는 성공/실패와 무관하게 결과 페이지로 이동한다.
- 결과는 30일 보존 후 cleanup 대상이 된다.
- 결과 페이지는 view model만 사용해 카드 단위로 렌더링한다.
- LLM은 넣지 않고 규칙형 목업 리포트만 생성한다.
- 랜딩 Hero에 AuroraBackground를 적용하고, 본문은 가독성 중심 카드 UI로 유지한다.
