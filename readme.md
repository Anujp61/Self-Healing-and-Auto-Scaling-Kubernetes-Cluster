

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


# Implement Auto-Scaling with Horizontal Pod Autoscaler (HPA)
- The Horizontal Pod Autoscaler (HPA) scales the number of pod replicas based on CPU or memory utilization. We’ll first ensure your Minikube cluster has the metrics server enabled, as HPA depends on it to monitor resources.

```
minikube addons enable metrics-server
```
- This will allow Kubernetes to gather CPU and memory metrics needed for autoscaling.

### Create HPA Configuration Files
- Now, let’s set up HPA for our backend deployment. This configuration will scale the backend deployment between 3 and 10 replicas based on CPU usage.

- Create a file called backend-hpa.yml with the following content:

```
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: backend-hpa
  namespace: sample-app
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: backend
  minReplicas: 3
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 50

```

### This configuration tells Kubernetes to monitor the CPU utilization of your backend deployment and adjust the replica count to maintain around 50% CPU usage.

- Apply the HPA configuration to your cluster:
```
kubectl apply -f backend-hpa.yaml
```

![alt text](<images/Screenshot 2024-11-12 200825.png>)

- You should see the HPA targeting your backend deployment, showing current and desired replicas.

# Add Observability with Prometheus and Grafana
- Setting up observability will allow you to monitor application metrics in real-time, track resource usage, and visualize data on Grafana dashboards.

### Install Prometheus and Grafana Using Helm
If you haven’t already installed Helm, you can follow this to set it up. Then, add the Prometheus Helm chart repository and install both Prometheus and Grafana:

```
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts

helm repo update

```

- Next, install Prometheus and Grafana in the monitoring namespace:

```
helm install prometheus prometheus-community/kube-prometheus-stack -n monitoring --create-namespace

```
- This will deploy both Prometheus and Grafana in your Minikube cluster.

#### Access Grafana Dashboard
- Once installed, forward the Grafana service port to access the Grafana UI locally:

```
kubectl port-forward -n monitoring svc/prometheus-grafana 3000:80
```
![alt text](<images/Screenshot 2024-11-12 203404.png>)

- By completing these steps, you’ll have autoscaling enabled for your backend service and a comprehensive observability stack with Prometheus and Grafana.

### References

https://kubernetes.io/docs/concepts/workloads/controllers/deployment/

https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/

https://kubernetes.io/docs/reference/kubectl/generated/kubectl_port-forward/

https://grafana.com/docs/grafana-cloud/monitor-infrastructure/kubernetes-monitoring/


