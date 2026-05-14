pipeline {
    agent { label 'slave-node2' }

    environment {
        DOCKER_HUB_REPO = "jakkalilokesh"
        BACKEND_IMAGE = "healthcare-diagnostic-backend"
        FRONTEND_IMAGE = "healthcare-diagnostic-frontend"
        IMAGE_TAG = "${BUILD_NUMBER}"

        BACKEND_CONTAINER = "healthcare-backend"
        FRONTEND_CONTAINER = "healthcare-frontend"
        MYSQL_CONTAINER = "healthcare-mysql"
        NETWORK_NAME = "healthcare-network"
        DB_NAME = "healthcare_diagnostic"
        DB_USER = "root"
        DB_PASS = "root123"
    }

    stages {

        stage('Checkout') {
            steps {
                cleanWs()
                checkout scm
                sh '''
                    echo "Git Branch: ${GIT_BRANCH}"
                    echo "Git Commit: ${GIT_COMMIT}"
                '''
            }
        }

stage('Backend Install & Test') {
    steps {
        dir('backend') {
            sh '''
                rm -rf venv
                python3 -m venv venv
                . venv/bin/activate

                pip install --upgrade pip
                pip install -r requirements.txt
                pip install pytest

                if find . -type f -name "test_*.py" | grep -q .; then
                    pytest
                else
                    echo "No backend tests found. Skipping pytest."
                fi
            '''
        }
    }
}

        stage('Frontend Install & Build') {
            steps {
                dir('frontend') {
                    sh '''
                        npm ci
                        npm run build
                    '''
                }
            }
        }

        stage('Train ML Model') {
            steps {
                sh '''
                    cd backend
                    . venv/bin/activate
                    cd ..

                    python3 ml/train_model.py

                    if [ ! -f "ml/models/heart_disease_model.pkl" ]; then
                        echo "ERROR: ML model file not found"
                        exit 1
                    fi

                    echo "ML model trained successfully"
                '''
            }
        }

        stage('Build Docker Images') {
            steps {
                sh '''
                    docker build \
                      -t ${DOCKER_HUB_REPO}/${BACKEND_IMAGE}:${IMAGE_TAG} \
                      -t ${DOCKER_HUB_REPO}/${BACKEND_IMAGE}:latest \
                      ./backend

                    docker build \
                      -t ${DOCKER_HUB_REPO}/${FRONTEND_IMAGE}:${IMAGE_TAG} \
                      -t ${DOCKER_HUB_REPO}/${FRONTEND_IMAGE}:latest \
                      ./frontend
                '''
            }
        }

        stage('Push Docker Images') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'dockerhub-creds',
                        usernameVariable: 'DOCKER_USER',
                        passwordVariable: 'DOCKER_PASS'
                    )
                ]) {
                    sh '''
                        echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin

                        docker push ${DOCKER_HUB_REPO}/${BACKEND_IMAGE}:${IMAGE_TAG}
                        docker push ${DOCKER_HUB_REPO}/${BACKEND_IMAGE}:latest

                        docker push ${DOCKER_HUB_REPO}/${FRONTEND_IMAGE}:${IMAGE_TAG}
                        docker push ${DOCKER_HUB_REPO}/${FRONTEND_IMAGE}:latest

                        docker logout
                    '''
                }
            }
        }

        stage('Deploy MySQL') {
            steps {
                sh '''
                    docker stop ${MYSQL_CONTAINER} || true
                    docker rm ${MYSQL_CONTAINER} || true
                    docker network rm ${NETWORK_NAME} || true

                    docker network create ${NETWORK_NAME}

                    docker run -d \
                      --name ${MYSQL_CONTAINER} \
                      --network ${NETWORK_NAME} \
                      -e MYSQL_ROOT_PASSWORD=${DB_PASS} \
                      -e MYSQL_DATABASE=${DB_NAME} \
                      -p 3306:3306 \
                      mysql:8
                '''
            }
        }

        stage('Wait for MySQL') {
            steps {
                sh '''
                    until docker exec ${MYSQL_CONTAINER} mysqladmin ping -h localhost --silent; do
                        echo "Waiting for MySQL..."
                        sleep 5
                    done
                '''
            }
        }

        stage('Deploy Backend') {
            steps {
                sh '''
                    docker stop ${BACKEND_CONTAINER} || true
                    docker rm ${BACKEND_CONTAINER} || true

                    docker run -d \
                      --name ${BACKEND_CONTAINER} \
                      --network ${NETWORK_NAME} \
                      -p 8000:8000 \
                      -e DATABASE_URL=mysql+pymysql://${DB_USER}:${DB_PASS}@${MYSQL_CONTAINER}:3306/${DB_NAME} \
                      ${DOCKER_HUB_REPO}/${BACKEND_IMAGE}:latest
                '''
            }
        }

        stage('Deploy Frontend') {
            steps {
                sh '''
                    docker stop ${FRONTEND_CONTAINER} || true
                    docker rm ${FRONTEND_CONTAINER} || true

                    docker run -d \
                      --name ${FRONTEND_CONTAINER} \
                      --network ${NETWORK_NAME} \
                      -p 80:80 \
                      ${DOCKER_HUB_REPO}/${FRONTEND_IMAGE}:latest
                '''
            }
        }
    }

    post {
        success {
            emailext(
                subject: "SUCCESS: Build #${BUILD_NUMBER}",
                body: """
Healthcare Diagnostic Platform deployed successfully.

Build Number: #${BUILD_NUMBER}

Backend Image:
${DOCKER_HUB_REPO}/${BACKEND_IMAGE}:${IMAGE_TAG}

Frontend Image:
${DOCKER_HUB_REPO}/${FRONTEND_IMAGE}:${IMAGE_TAG}
""",
                to: "lokesh.j.g13cs@gmail.com"
            )
        }

        failure {
            emailext(
                subject: "FAILED: Build #${BUILD_NUMBER}",
                body: """
Healthcare Diagnostic Platform pipeline failed.

Build Number: #${BUILD_NUMBER}

Check Jenkins console logs.
""",
                to: "lokesh.j.g13cs@gmail.com"
            )
        }
    }
}
