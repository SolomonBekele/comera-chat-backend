# Setting Up Zrok and Nginx

This document provides step-by-step instructions to install and use **Zrok** and **Nginx**, along with explanations of their purposes and practical uses.

---

## 1. Zrok

### **What is Zrok?**

Zrok is a secure tunneling tool that allows you to expose **local services** (like a Node.js server or a web application running on your laptop) to the public internet without deploying them to a cloud server.

**Use cases:**

* Share your local development server with teammates or clients
* Test webhooks from third-party services (e.g., Stripe, GitHub, Twilio)
* Demo apps in real-time without deployment
* Temporarily expose APIs for testing or debugging

**Advantages:**

* No need to configure router port forwarding or public IPs
* Generates a secure public URL for your local server
* Supports HTTPS out-of-the-box
* Easy to enable/disable tunnels

---

### **Installation Steps**

1. Go to the official Zrok website: [https://zrok.io/](https://zrok.io/)
2. Click on **Get Started**
3. Create an account or log in if you already have one
4. Download the Zrok binary for your OS
5. Extract the archive. It contains the `zrok` executable
6. Move the binary to a directory in your PATH so it can be accessed globally:

```bash
sudo mv zrok /usr/local/bin/zrok
```

7. Make the binary executable:

```bash
sudo chmod +x /usr/local/bin/zrok
```

8. Verify the installation:

```bash
zrok version
```

---

### **Enabling Your Zrok Environment**

1. Log into the API console: [https://api-v1.zrok.io/](https://api-v1.zrok.io/)
2. Copy your **Account Token**
3. Enable your Zrok environment:

```bash
zrok enable <Account Token>
```

---

### **Using Zrok**

* To expose a local service (example: a web server running on port 3000):

```bash
zrok http 3000
```

* Zrok generates a **public URL** that can be accessed from anywhere
* Stop the tunnel anytime by pressing `Ctrl+C`
* Check running tunnels:

```bash
zrok list
```

* View logs:

```bash
zrok logs <Tunnel ID>
```

---

### **Notes**

* Keep your Account Token secure; do not share it publicly
* Zrok tunnels are temporary and meant for **development, testing, or demos**
* Combine Zrok with a local reverse proxy like **Nginx** for more complex setups

---

## 2. Nginx

### **What is Nginx?**

Nginx is a high-performance **web server and reverse proxy** that can handle HTTP, HTTPS, TCP, and UDP traffic. It’s widely used in production environments to serve websites, APIs, and as a **load balancer**.

**Use cases:**

* Serve static files (HTML, CSS, JS) quickly
* Reverse proxy for Node.js, Python, or other backend services
* Load balancing across multiple backend servers
* Terminate SSL/TLS connections
* Cache content to improve performance

**Advantages:**

* Extremely fast and lightweight
* Can handle thousands of concurrent connections
* Flexible configuration for multiple sites/services
* Works well with Docker, microservices, and modern web apps

---

### **Installation Steps (macOS using Homebrew)**

1. Install Nginx:

```bash
brew install nginx
```

2. Start Nginx:

```bash
brew services start nginx
```

3. Check Nginx version:

```bash
nginx -v
```

4. Access the default Nginx page in a browser:

```
http://localhost:8080
```

> By default, Homebrew runs Nginx on **port 8080**.

5. Stop or restart Nginx:

```bash
brew services stop nginx
brew services restart nginx
```

---

### **Configuration**

* The main configuration file is located at:

```text
/usr/local/etc/nginx/nginx.conf
```

* Add **server blocks** to configure reverse proxy for Node.js or other services
* Reload Nginx after configuration changes:

```bash
nginx -s reload
```

* Always test the configuration before reloading:

```bash
nginx -t
```

---

### **Combining Nginx and Zrok**

* Use Nginx to reverse proxy multiple local services (Node.js apps) to different paths or ports
* Use Zrok to expose Nginx to the public internet, giving a single public URL to all services
* Example:

  * Node.js app on `localhost:3000`
  * Node.js app on `localhost:3001`
  * Nginx routes `/app1` → `localhost:3000` and `/app2` → `localhost:3001`
  * Zrok exposes Nginx at `https://<zrok-tunnel>.zrok.io`

---

### **Additional Tips**

* Ensure ports used by Node.js apps do not conflict with Nginx
* Regularly update Nginx with:

```bash
brew update && brew upgrade nginx
```

* Use HTTPS via Zrok or Nginx for secure testing
* For production, combine Nginx with a proper SSL certificate and monitoring

---

