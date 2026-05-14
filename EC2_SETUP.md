# EC2 Setup Guide for Jenkins CI/CD Pipeline

This guide covers the setup for both Jenkins master and slave nodes on AWS EC2.

## Jenkins Master Node EC2

### Instance Type
- **Minimum**: t3.medium (2 vCPU, 4 GB RAM)
- **Recommended**: t3.large (2 vCPU, 8 GB RAM)

### Required Software

```bash
# Update system
sudo apt-get update && sudo apt-get upgrade -y

# Install Java (Jenkins requires Java 11 or higher)
sudo apt-get install -y openjdk-11-jdk

# Install Jenkins
wget -q -O - https://pkg.jenkins.io/debian-stable/jenkins.io.key | sudo apt-key add -
sudo sh -c 'echo deb https://pkg.jenkins.io/debian-stable binary/ > /etc/apt/sources.list.d/jenkins.list'
sudo apt-get update
sudo apt-get install -y jenkins

# Enable and start Jenkins
sudo systemctl enable jenkins
sudo systemctl start jenkins

# Install Docker (for building images if needed)
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker jenkins

# Install Git
sudo apt-get install -y git

# Install AWS CLI (optional)
sudo apt-get install -y awscli
```

### Ports to Expose (Security Group)

| Port | Protocol | Source | Purpose |
|------|----------|--------|---------|
| 8080 | TCP | Your IP (or 0.0.0.0/0) | Jenkins Web UI |
| 22 | TCP | Your IP (or 0.0.0.0/0) | SSH access |
| 443 | TCP | 0.0.0.0/0 | HTTPS (if using reverse proxy) |

### Initial Jenkins Setup

1. Get initial admin password:
```bash
sudo cat /var/lib/jenkins/secrets/initialAdminPassword
```

2. Access Jenkins: `http://<master-public-ip>:8080`

3. Install suggested plugins during setup

4. Configure global security:
   - Enable agent protocols
   - Configure SSH credentials for slave connection

---

## Jenkins Slave Node EC2

### Instance Type
- **Minimum**: t3.medium (2 vCPU, 4 GB RAM)
- **Recommended**: t3.large (2 vCPU, 8 GB RAM) or t3.xlarge (4 vCPU, 16 GB RAM)

### Required Software

```bash
# Update system
sudo apt-get update && sudo apt-get upgrade -y

# Install Java (required for Jenkins agent)
sudo apt-get install -y openjdk-11-jdk

# Install Docker (required for building and running containers)
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add jenkins user to docker group
sudo usermod -aG docker jenkins

# Enable and start Docker
sudo systemctl enable docker
sudo systemctl start docker

# Install Python 3 (for backend tests and ML model training)
sudo apt-get install -y python3 python3-pip python3-venv

# Install Node.js and npm (for frontend build)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Git
sudo apt-get install -y git

# Install build essentials
sudo apt-get install -y build-essential

# Create jenkins user (if not exists)
sudo useradd -m -s /bin/bash jenkins || true
sudo usermod -aG docker jenkins
```

### Ports to Expose (Security Group)

| Port | Protocol | Source | Purpose |
|------|----------|--------|---------|
| 22 | TCP | Master node IP only | SSH from Jenkins master |
| 8000 | TCP | Your IP (or 0.0.0.0/0) | Backend API (after deployment) |
| 80 | TCP | Your IP (or 0.0.0.0/0) | Frontend (after deployment) |
| 3306 | TCP | Slave node only (internal) | MySQL (don't expose publicly) |

### Configure SSH Access

```bash
# On slave node, ensure SSH is running
sudo systemctl enable ssh
sudo systemctl start ssh

# Allow Jenkins master to connect via SSH
# Option 1: Password-based authentication
# Ensure password authentication is enabled in /etc/ssh/sshd_config
# PasswordAuthentication yes

# Option 2: Key-based authentication (recommended)
# Generate SSH key on master and copy to slave
```

---

## Security Group Configuration

### Master Node Security Group

**Inbound Rules:**
- HTTP (8080) from Your IP (or 0.0.0.0/0)
- SSH (22) from Your IP
- HTTPS (443) from Your IP (optional)

**Outbound Rules:**
- All traffic (0.0.0.0/0)

### Slave Node Security Group

**Inbound Rules:**
- SSH (22) from Master node Security Group
- HTTP (8000) from Your IP (for accessing deployed app)
- HTTP (80) from Your IP (for accessing frontend)
- Custom (50000) from Master node Security Group (Jenkins JNLP agent port)

**Outbound Rules:**
- All traffic (0.0.0.0/0)

---

## Additional Setup Steps

### 1. Configure Jenkins Master to Connect to Slave

In Jenkins UI:
1. Go to Manage Jenkins → Manage Nodes
2. Click "New Node"
3. Node name: `slave-node`
4. Type: Permanent Agent
5. Remote root directory: `/home/jenkins`
6. Labels: `slave-node`
7. Launch method: Launch agents by SSH
8. SSH Hostname: Slave node public IP
9. SSH Credentials: Add SSH credentials
10. Host Key Verification Strategy: Known hosts file

### 2. Increase Docker Storage (Optional)

```bash
# On slave node, if you need more storage for Docker images
# Create a separate EBS volume and mount it to /var/lib/docker
sudo mkfs.ext4 /dev/xvdf
sudo mount /dev/xvdf /var/lib/docker
echo '/dev/xvdf /var/lib/docker ext4 defaults 0 0' | sudo tee -a /etc/fstab
```

### 3. Configure Swap Space (Recommended)

```bash
# Add swap space to prevent OOM during builds
sudo fallocate -l 4G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

### 4. Install Additional Python Packages (Slave Node)

```bash
# Install Python development tools
sudo apt-get install -y python3-dev python3-setuptools

# Install commonly used Python packages globally
sudo pip3 install pip --upgrade
sudo pip3 install virtualenv
```

### 5. Configure Docker Cleanup (Slave Node)

```bash
# Create a cron job to clean up Docker images periodically
(crontab -l 2>/dev/null; echo "0 2 * * * docker system prune -af --filter 'until=24h'") | crontab -
```

---

## IAM Roles (Optional but Recommended)

### For Master Node
Create IAM role with:
- EC2 read access (for managing instances)
- S3 access (if storing artifacts)

### For Slave Node
Create IAM role with:
- ECR access (if using AWS ECR instead of Docker Hub)
- S3 access (if storing ML models or datasets)

---

## Network Configuration

### VPC Setup
- Use the same VPC for both master and slave
- Place both in the same subnet or different subnets with routing
- Enable DNS resolution and DNS hostnames

### Security Best Practices
- Use security groups to restrict access
- Don't expose MySQL (3306) publicly
- Use bastion host for SSH access in production
- Enable VPC flow logs for monitoring

---

## Monitoring and Logging

### Install CloudWatch Agent (Optional)

```bash
# On both nodes
sudo apt-get install -y amazon-cloudwatch-agent
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl -a fetch-config -m ec2 -s -c s3://your-bucket/config.json
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl -a start
```

---

## Verification Steps

### Master Node Verification
```bash
# Check Jenkins status
sudo systemctl status jenkins

# Check Java version
java -version

# Check Jenkins logs
sudo tail -f /var/log/jenkins/jenkins.log
```

### Slave Node Verification
```bash
# Check Docker status
sudo systemctl status docker

# Check Docker can run
sudo docker run hello-world

# Check Python version
python3 --version

# Check Node.js version
node --version
npm --version

# Check SSH access
# From master: ssh jenkins@<slave-ip>
```

---

## Troubleshooting

### Jenkins Master Issues
- **Jenkins won't start**: Check Java installation and logs
- **Can't access Jenkins UI**: Check security group rules
- **Slave connection fails**: Verify SSH credentials and network connectivity

### Slave Node Issues
- **Docker permission denied**: Ensure jenkins user is in docker group
- **Out of memory**: Add swap space or upgrade instance type
- **Build fails**: Check all required software is installed

---

## Cost Optimization

- Use t3 instances for cost savings
- Stop instances when not in development
- Use Spot Instances for slave nodes (if acceptable)
- Enable instance termination protection for master
