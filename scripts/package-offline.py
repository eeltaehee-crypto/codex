"""Package the self-contained BUSAFE HTML for another computer."""
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED

root = Path(__file__).resolve().parent.parent
html = (root / "busafe.html").read_bytes()
readme = """BUSAFE — 다른 컴퓨터에서 실행하기

1. busafe-offline.zip을 다운로드합니다.
2. ZIP 파일을 마우스 오른쪽 버튼으로 클릭해 '압축 풀기' 또는 '모두 추출'을 선택합니다.
3. 압축을 푼 폴더의 BUSAFE.html을 Chrome 또는 Edge로 엽니다.
   더블클릭으로 열리지 않으면 '연결 프로그램 → Chrome / Edge'를 선택하세요.

Node.js, 프로그램 설치, 서버 실행은 필요하지 않습니다.
사진과 실행 코드가 HTML 파일 안에 포함되어 있습니다.
인터넷 없이도 점검과 기록 저장 기능을 사용할 수 있습니다.
인터넷이 없으면 글꼴은 시스템 글꼴로 표시됩니다.
외부 기관 홈페이지와 전화 연결은 인터넷 또는 기기 전화 기능이 필요합니다.

사용 방법
- 점검 시작 → 소화기 설치 위치 선택 → 압력 확인 → 추가 확인 → 최종 저장
- QR 스캔은 사용하지 않습니다.
- '내 정보'에서 지정 기관명과 전화번호를 등록할 수 있습니다.
- 생성된 제품 이미지는 연출용이며 실제 점검은 차량의 소화기를 확인하세요.

기록 보관
- 기록과 첨부 사진은 사용하는 컴퓨터의 해당 브라우저에 저장됩니다.
- 다른 컴퓨터로 ZIP을 옮겨도 기존 점검 기록은 자동으로 따라가지 않습니다.
- 브라우저 데이터를 지우거나 HTML 파일 경로를 바꾸면 기존 기록이 보이지 않을 수 있습니다.
- 필요한 기록은 '점검 기록 → CSV 다운로드'로 별도 보관하세요. CSV에는 사진이 포함되지 않습니다.
- 기관에 점검 내용이 자동으로 전송되지는 않습니다.

처음에는 시연 데이터가 표시됩니다. 직접 입력한 기록은 '로컬 입력'으로 구분됩니다.
"""
archive = root / "busafe-offline.zip"
with ZipFile(archive, "w", compression=ZIP_DEFLATED, compresslevel=9) as bundle:
    bundle.writestr("BUSAFE.html", html)
    bundle.writestr("README.txt", readme.encode("utf-8-sig"))
with ZipFile(archive) as bundle:
    assert bundle.testzip() is None
    assert bundle.read("BUSAFE.html") == html
    assert set(bundle.namelist()) == {"BUSAFE.html", "README.txt"}
print(f"Created {archive.name}: {archive.stat().st_size:,} bytes; HTML and instructions verified.")
