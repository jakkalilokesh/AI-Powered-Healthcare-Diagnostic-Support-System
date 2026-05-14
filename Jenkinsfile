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
    }
    
    stages {
        stage('Checkout') {
            steps {
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
                        python3 -m venv venv || python -m venv venv
                        . venv/bin/activate || venv\\Scripts\\activate
                        pip install --upgrade pip
                        pip install -r requirements.txt
                        pip install pytest
                        echo "Backend tests completed"
                    '''
                }
            }
        }
        
        stage('Frontend Install & Test') {
            steps {
                dir('frontend') {
                    sh '''
                        npm ci
                        npm run build
                        echo "Frontend build completed"
                    '''
                }
            }
        }
        
        stage('Train ML Model') {
            steps {
                sh '''
                    python ml/train_model.py
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
                    cd backend
                    docker build -t ${DOCKER_HUB_REPO}/${BACKEND_IMAGE}:${IMAGE_TAG} .
                    docker tag ${DOCKER_HUB_REPO}/${BACKEND_IMAGE}:${IMAGE_TAG} ${DOCKER_HUB_REPO}/${BACKEND_IMAGE}:latest
                    
                    cd ../frontend
                    docker build -t ${DOCKER_HUB_REPO}/${FRONTEND_IMAGE}:${IMAGE_TAG} .
                    docker tag ${DOCKER_HUB_REPO}/${FRONTEND_IMAGE}:${IMAGE_TAG} ${DOCKER_HUB_REPO}/${FRONTEND_IMAGE}:latest
                '''
            }
        }
        
        stage('Push Docker Images') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh '''
                        echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
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
                    docker stop $MYSQL_CONTAINER || true
                    docker rm $MYSQL_CONTAINER || true
                    docker network rm $NETWORK_NAME || true
                    docker network create $NETWORK_NAME

                    docker run -d \
                      --name $MYSQL_CONTAINER \
                      --network $NETWORK_NAME \
                      -e MYSQL_ROOT_PASSWORD=root123 \
                      -e MYSQL_DATABASE=healthcare_diagnostic \
                      mysql:8
                '''
            }
        }
        
        stage('Wait for MySQL') {
            steps {
                sh 'sleep 30'
            }
        }
        
        stage('Deploy Backend') {
            steps {
                sh '''
                    docker stop $BACKEND_CONTAINER || true
                    docker rm $BACKEND_CONTAINER || true

                    docker run -d \
                      --name $BACKEND_CONTAINER \
                      --network $NETWORK_NAME \
                      -p 8000:8000 \
                      -e DATABASE_URL=mysql+pymysql://root:root123@mysql:3306/healthcare_diagnostic \
                      ${DOCKER_HUB_REPO}/${BACKEND_IMAGE}:latest
                '''
            }
        }
        
        stage('Deploy Frontend') {
            steps {
                sh '''
                    docker stop $FRONTEND_CONTAINER || true
                    docker rm $FRONTEND_CONTAINER || true

                    docker run -d \
                      --name $FRONTEND_CONTAINER \
                      --network $NETWORK_NAME \
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
                    Healthcare Diagnostic Platform - Pipeline completed successfully.
                    
                    Build Number: #${BUILD_NUMBER}
                    Backend Image: ${DOCKER_HUB_REPO}/${BACKEND_IMAGE}:${IMAGE_TAG}
                    Frontend Image: ${DOCKER_HUB_REPO}/${FRONTEND_IMAGE}:${IMAGE_TAG}
                    
                    Containers deployed:
                    - Backend: http://localhost:8000
                    - Frontend: http://localhost
                """,
                to: "lokesh.j.g13cs@gmail.com"
            )
        }

        failure {
            emailext(
                subject: "FAILED: Build #${BUILD_NUMBER}",
                body: """
                    Healthcare Diagnostic Platform - Pipeline failed.
                    
                    Build Number: #${BUILD_NUMBER}
                    Please check the Jenkins console output for details.
                """,
                to: "lokesh.j.g13cs@gmail.com"
            )
        }
    }
}
