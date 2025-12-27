# Docker 기반 Jenkins CI/CD 파이프라인 구축

이 프로젝트는 **GitHub → Jenkins → Docker Hub → 컨테이너 배포**까지 자동화하는 CI/CD 예제입니다.  
Node.js 예제 프로젝트를 기준으로 작성되었습니다.

---

## 🔹 요구 사항

- Windows / Linux 환경
- Docker & Docker Compose 설치
- Jenkins (Docker 컨테이너로 실행)
- GitHub 저장소
- Docker Hub 계정 및 Personal Access Token (PAT)

---

## 🔹 폴더 구조 예시
docker-example/
├─ Dockerfile
├─ package.json
├─ index.js
└─ docker-compose.yml


---

## 🔹 1️⃣ docker-compose.yml 예시

```yaml
version: '3.8'

services:
  jenkins:
    image: jenkins/jenkins:lts-jdk17
    container_name: jenkins
    user: root
    ports:
      - "8080:8080"
      - "50000:50000"
    volumes:
      - ./jenkins_home:/var/jenkins_home
      - /var/run/docker.sock:/var/run/docker.sock

/var/run/docker.sock를 연결해 Jenkins 컨테이너에서 Docker CLI 사용 가능

2️⃣ Jenkins 초기 설정

Jenkins 컨테이너 실행:

docker compose up -d


브라우저 접속: http://localhost:8080

초기 비밀번호 확인:

docker logs jenkins


또는

docker exec -it jenkins cat /var/jenkins_home/secrets/initialAdminPassword


Install suggested plugins 클릭

관리자 계정 생성

🔹 3️⃣ Jenkins Credentials 설정

Jenkins → Manage Jenkins → Credentials → Global → Add Credentials

입력:

Kind: Username with password

Username: Docker Hub ID

Password: Personal Access Token (PAT)

ID: dockerhub-creds ← Jenkinsfile과 동일

Description: Docker Hub Token

Save

🔹 4️⃣ Jenkinsfile 예시
pipeline {
    agent any

    environment {
        IMAGE_NAME = "lycoskim/docker-example"
        IMAGE_TAG  = "${BUILD_NUMBER}"
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'master',
                    url: 'https://github.com/lycos-kim/docker-example.git',
                    credentialsId: 'github-token'
            }
        }

        stage('Docker Image Build') {
            steps {
                sh "docker build -t ${IMAGE_NAME}:${IMAGE_TAG} ."
            }
        }

        stage('Push to Docker Hub') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh '''
                        echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
                        docker push ${IMAGE_NAME}:${IMAGE_TAG}
                    '''
                }
            }
        }

        stage('Deploy (Run Container)') {
            steps {
                sh '''
                    docker stop docker-example || true
                    docker rm docker-example || true
                    docker run -d \
                      --name docker-example \
                      -p 8081:8080 \
                      ${IMAGE_NAME}:${IMAGE_TAG}
                '''
            }
        }
    }
}


credentialsId: 'dockerhub-creds'와 Jenkins Credentials ID는 반드시 일치해야 함

🔹 5️⃣ 빌드 & 배포

Jenkins Job → Build Now

로그 확인:

Checkout ✔
Docker Image Build ✔
Push to Docker Hub ✔
Deploy ✔


브라우저에서 서비스 확인:

http://localhost:8081

🔹 6️⃣ 요약

GitHub → Jenkins → Docker Hub → 컨테이너 배포까지 자동화

Docker-in-Docker 환경 구성 필요 (/var/run/docker.sock 연결)

Jenkins Credential ID와 Jenkinsfile credentialsId 일치 필수

Personal Access Token 사용으로 안전하게 Docker Hub 로그인
