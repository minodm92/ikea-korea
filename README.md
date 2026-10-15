# IKEA Korea 리디자인

IKEA Korea 웹사이트를 Figma 시안을 기준으로 구현한 개인 퍼블리싱 프로젝트입니다. HTML, CSS, JavaScript만 사용하는 정적 웹사이트이며 별도의 프레임워크나 빌드 도구가 필요하지 않습니다.

## 기준 자료

- Figma: [웹사이트 제작 개인 작업](https://www.figma.com/design/469QJ2kvXOv0UiTJhcwZvt/)
- 디자인 규칙: [`DESIGN_GUIDELINES.md`](./DESIGN_GUIDELINES.md)
- 기준 해상도: `1920px`
- 기본 서체: Pretendard, Manjari

화면 구성과 수치는 Figma를 우선하며, 인터랙션은 프로젝트의 레퍼런스 영상과 사이트 동작을 바탕으로 구현했습니다.

## 실행 방법

브라우저의 로컬 파일 열기보다 로컬 서버 사용을 권장합니다.

```powershell
python -m http.server 4173 --bind 127.0.0.1
```

서버 실행 후 아래 주소로 접속합니다.

```text
http://127.0.0.1:4173/index.html
```

VS Code의 Live Server 확장을 사용해 `index.html`을 열어도 됩니다.

## 주요 기능

- 반응형 헤더와 전체 메뉴·검색 패널
- 아래 방향 스크롤 시 헤더 숨김
- 역방향 스크롤 시 반투명 헤더 노출
- 화면 높이 기반 히어로 섹션
- 방 콘텐츠의 스크롤 핀과 순차 텍스트 리빌
- 방 목록 클릭 시 해당 핀 콘텐츠로 이동
- 현재 방을 나타내는 원형 마커 애니메이션
- 카테고리, 에디토리얼, DIY 및 멤버십 카드 레이아웃
- Intersection Observer 기반 콘텐츠 리빌
- 접근성용 모션 감소 설정 지원

## 파일 구조

```text
.
├─ index.html             페이지 마크업
├─ style.css              레이아웃과 인터랙션 스타일
├─ script.js              스크롤·메뉴·검색 인터랙션
├─ reset.css              브라우저 기본 스타일 초기화
├─ tokens.css             색상·서체·간격 디자인 토큰
├─ DESIGN_GUIDELINES.md   디자인 구현 기준
├─ assets/                이미지와 아이콘 원본
└─ dist/                  배포용 정적 파일
```

## 작업 시 유의사항

- 디자인을 수정할 때는 연결된 Figma 노드의 최신 값을 먼저 확인합니다.
- 소스 파일을 수정한 뒤 대응하는 파일을 `dist`에도 동일하게 반영합니다.
- `assets`의 Figma 임시 URL을 HTML에서 직접 사용하지 않습니다.
- 방 콘텐츠의 핀 위치는 `position: sticky` 상태의 `offsetTop`이 아니라 일반 문서 흐름 높이와 마진으로 계산합니다.
- `prefers-reduced-motion` 환경에서는 리빌·회전 효과가 비활성화됩니다.

## 배포

현재 프로젝트는 별도의 Git 저장소나 배포 서비스에 연결되어 있지 않습니다. `dist` 폴더는 정적 호스팅에 올릴 수 있도록 소스와 동기화된 결과물입니다.
