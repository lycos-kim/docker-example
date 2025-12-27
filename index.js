const express = require('express');

const app = express();

// README 요약 내용
const readmeSummary = `
<h1>🐳 Docker + Jenkins CI/CD 예제 🐳</h1>

<h2>1️⃣ 요구 사항</h2>
<ul>
  <li>Docker & Docker Compose</li>
  <li>Jenkins (Docker 컨테이너)</li>
  <li>GitHub 저장소</li>
  <li>Docker Hub 계정 + Personal Access Token</li>
</ul>

<h2>2️⃣ Jenkins 설정</h2>
<ul>
  <li>http://localhost:8080 접속</li>
  <li>초기 비밀번호 확인 및 관리자 생성</li>
  <li>Credentials 추가: ID = <b>dockerhub-creds</b></li>
</ul>

<h2>3️⃣ Jenkinsfile 흐름</h2>
<ol>
  <li>Checkout: GitHub 코드 가져오기</li>
  <li>Docker Build: 이미지 생성</li>
  <li>Push to Docker Hub: 이미지 업로드</li>
  <li>Deploy: 컨테이너 실행</li>
</ol>

<h2>4️⃣ Docker</h2>
<ul>
  <li>Dockerfile 기반 Node.js 앱</li>
  <li>포트 8081 노출</li>
</ul>

<h2>5️⃣ 확인</h2>
<ul>
  <li>브라우저: http://localhost:8081</li>
  <li>페이지 메시지: "🐳 Dream Coding in Docker! Git 🐳"</li>
</ul>
`;

app.get('/', (req, res) => {
  res.send(readmeSummary);
});

//app.listen(8082, () => console.log('Server is running 🤖'));
