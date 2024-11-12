

# Project Overview: Self-Healing and Auto-Scaling Kubernetes Cluster
## The goal is to create a Kubernetes cluster that can:

- Automatically recover from node and pod failures.
- Scale based on resource demand.
- Provide real-time observability and alerting.

## Prerequisites
```
Docker: To build and push images.
Minikube: To run a Kubernetes cluster locally.
kubectl: To manage Kubernetes resources.
```

# Getting Started

## Step 1: Clone the Repository
```
git clone <repository-url>
cd <repository-name>

```
## Step 2: Build and Push Docker Images
- Build and tag the Docker images for both backend and frontend.
- Push the images to Docker Hub (ensure you replace <your-dockerhub-username> with your Docker Hub username).

```
# Backend Image
docker build -t <your-dockerhub-username>/backend:1.0 -f backend/Dockerfile .
docker push <your-dockerhub-username>/backend:1.0

# Frontend Image
docker build -t <your-dockerhub-username>/frontend:1.0 -f frontend/Dockerfile .
docker push <your-dockerhub-username>/frontend:1.0

```
## Step 3: Start Minikube
- Start a Minikube cluster with docker(You can choose driver according to your need)

```
minikube start --driver=docker

```
![alt text](<images/Screenshot 2024-11-12 123212.png>)

- Optionally, enable the Minikube ingress addon if you need it:

```
minikube addons enable ingress
```
## Step 4: Create Kubernetes Namespace
- Create a namespace to organize resources for this application.
```
kubectl create namespace sample-app
```
## Step 5: Deploy the Application to Kubernetes
- Apply the Kubernetes YAML files for both backend and frontend services and deployments.
```
kubectl apply -f backend-deployment.yaml
kubectl apply -f backend-service.yaml
kubectl apply -f frontend-deployment.yaml
kubectl apply -f frontend-service.yaml

```
## Step 6: Verify Deployments and Services
- Check that all pods and services are running:
```
kubectl get pods -n sample-app
kubectl get services -n sample-app
```
![alt text](<images/Screenshot 2024-11-12 123250.png>)
![alt text](<images/Screenshot 2024-11-12 123315.png>)

## Step 7: Access the Frontend Service
- Since the frontend is exposed as a NodePort, you can access it using Minikube:
```
minikube service frontend -n sample-app --url
```
![alt text](<images/Screenshot 2024-11-12 123138.png>)
- This command will output a URL (e.g., http://<minikube-ip>:30007). Open this URL in your browser to see the frontend application interact with the backend.
![alt text](<images/Screenshot 2024-11-12 123445.png>)


