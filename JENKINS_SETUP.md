# Jenkins CI/CD Pipeline Setup Guide

This guide explains how to set up the Jenkins CI/CD pipeline for the Healthcare Diagnostic Platform.

## Prerequisites

- Jenkins server installed and running
- Docker installed on Jenkins slave node
- Docker Hub account
- SSH access to deployment server
- Email server configured for notifications

## Jenkins Configuration

### 1. Install Required Plugins

Install the following Jenkins plugins:
- Docker Pipeline
- Docker Build Step
- Email Extension Plugin
- SSH Agent Plugin
- Pipeline Utility Steps
- Git Plugin

### 2. Configure Credentials

Add the following credentials in Jenkins (Manage Jenkins → Credentials):

#### Docker Hub Credentials
- **ID**: `docker-hub-credentials`
- **Username**: Your Docker Hub username
- **Password**: Your Docker Hub password or access token
- **Description**: Docker Hub credentials for pushing images

#### SSH Credentials (for deployment)
- **ID**: `deploy-server-ssh`
- **Username**: `deploy` (or your deployment user)
- **Private Key**: SSH private key for deployment server
- **Description**: SSH credentials for deployment

### 3. Configure Email Notifications

Go to Manage Jenkins → Configure System → Email Extension:

- **SMTP Server**: Your SMTP server address (e.g., smtp.gmail.com)
- **SMTP Port**: 587 (TLS) or 465 (SSL)
- **Username**: Your email address
- **Password**: Your email password or app-specific password
- **Default Recipients**: Your email address
- **Default Subject**: `$PROJECT_NAME - Build #$BUILD_NUMBER - $BUILD_STATUS`
- **Default Content**: Use the HTML template from Jenkinsfile

### 4. Update Jenkinsfile Variables

Edit the `Jenkinsfile` and update the following environment variables:

```groovy
environment {
    // Docker Hub credentials (ID must match your Jenkins credential ID)
    DOCKER_HUB_CREDENTIALS = credentials('docker-hub-credentials')
    DOCKER_HUB_REPO = 'your-dockerhub-username'  // Your Docker Hub username
    
    // Email recipients
    EMAIL_RECIPIENTS = 'your-email@example.com,team@example.com'
    
    // Deployment server
    DEPLOY_SERVER = 'your-deploy-server.com'  // Your deployment server IP or domain
    DEPLOY_USER = 'deploy'  // SSH username on deployment server
}
```

### 5. Create Jenkins Job

1. Click "New Item" in Jenkins
2. Enter job name: `healthcare-diagnostic-platform`
3. Select "Pipeline"
4. Click "OK"

### 6. Configure Pipeline Job

Under "Pipeline" section:
- **Definition**: Pipeline script from SCM
- **SCM**: Git
- **Repository URL**: Your GitHub repository URL
- **Credentials**: Your GitHub credentials
- **Branch Specifier**: `*/main` (or your main branch)
- **Script Path**: `Jenkinsfile`

### 7. Configure Build Triggers (Optional)

Add build triggers as needed:
- **GitHub hook trigger for GITScm polling**: For automatic builds on push
- **Poll SCM**: Schedule periodic checks (e.g., `H/5 * * * *` for every 5 minutes)
- **Build periodically**: Schedule builds (e.g., `H H(0-2) * * *` for daily at midnight-2am)

## Deployment Server Setup

### 1. Install Docker on Deployment Server

```bash
# Update package index
sudo apt-get update

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add user to docker group
sudo usermod -aG docker deploy
```

### 2. Setup Application Directory

```bash
# Create application directory
sudo mkdir -p /opt/healthcare-diagnostic
sudo chown deploy:deploy /opt/healthcare-diagnostic

# Clone repository (or copy files)
cd /opt/healthcare-diagnostic
git clone <your-repo-url> .
```

### 3. Configure Environment

```bash
# Copy environment files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Edit environment files with production values
nano backend/.env
nano frontend/.env
```

### 4. Setup Docker Compose

```bash
# Start services
docker-compose up -d

# Verify services are running
docker-compose ps
```

## Pipeline Stages

The Jenkins pipeline includes the following stages:

1. **Checkout**: Clone code from GitHub
2. **Setup Environment**: Configure environment variables
3. **Backend Tests**: Run Python tests
4. **Frontend Tests**: Run JavaScript tests
5. **Train ML Model**: Train and save ML model
6. **Build Docker Images**: Build backend and frontend images
7. **Push to Docker Hub**: Push images to Docker Hub registry
8. **Deploy**: Deploy to production server via SSH
9. **Health Check**: Verify deployment health

## Email Notifications

The pipeline sends email notifications for:

- **Success**: Green email with deployment summary
- **Failure**: Red email with error details
- **Unstable**: Orange email with warnings

Emails include:
- Build number and URL
- Git branch and commit information
- Deployment details
- Error information (if applicable)

## Troubleshooting

### Docker Login Failed
- Verify Docker Hub credentials in Jenkins
- Check if Docker Hub account is active
- Ensure credentials have push permissions

### SSH Connection Failed
- Verify SSH credentials in Jenkins
- Check if deployment server is accessible
- Ensure SSH key is authorized on deployment server

### Tests Failed
- Check console output for specific test failures
- Verify all dependencies are installed
- Check test configuration

### Deployment Failed
- Verify deployment server is accessible
- Check Docker is running on deployment server
- Review docker-compose logs: `docker-compose logs`

### Health Check Failed
- Verify services are running: `docker-compose ps`
- Check service logs: `docker-compose logs backend`
- Ensure ports are not blocked by firewall

## Security Best Practices

1. **Use Jenkins Credentials**: Never hardcode passwords in Jenkinsfile
2. **Docker Hub Access Tokens**: Use access tokens instead of passwords
3. **SSH Keys**: Use SSH keys instead of passwords for deployment
4. **Secrets Management**: Use environment variables for sensitive data
5. **Regular Updates**: Keep Jenkins and plugins updated
6. **Access Control**: Restrict Jenkins access to authorized users

## Monitoring

Monitor pipeline execution:
- Jenkins dashboard shows build history
- Check build logs for detailed information
- Set up Jenkins monitoring/alerting
- Monitor deployment server resources

## Rollback Procedure

If deployment fails:

1. Jenkins automatically keeps last 10 builds
2. Use previous Docker image tag: `docker-compose pull`
3. Or manually rollback:
   ```bash
   docker-compose down
   docker-compose up -d
   ```

## Support

For issues with:
- **Jenkins**: Check Jenkins logs at `/var/log/jenkins/`
- **Docker**: Check Docker logs with `docker logs`
- **Deployment**: Check deployment server logs
- **Email**: Verify SMTP configuration
