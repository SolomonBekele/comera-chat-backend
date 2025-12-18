Sure! Here's a clean **README.md** file for your MongoDB Docker setup with manual replica set initialization:

````markdown
# MongoDB Docker Setup with Manual Replica Set

This document describes how to set up a **single-node MongoDB replica set** using Docker Compose for the Chat App Backend.

---

## 1. Docker Compose Configuration

Create a `docker-compose.yml` file with the following content:

```yaml
services:
  mongo:
    image: mongo:6
    container_name: chat-app-backend-mongo-1
    restart: always
    ports:
      - "27017:27017"
    command: >
      mongod
      --auth
      --replSet rs0
      --keyFile /etc/mongo-keyfile/mongo-keyfile
      --bind_ip_all
    environment:
      MONGO_INITDB_ROOT_USERNAME: root
      MONGO_INITDB_ROOT_PASSWORD: root123
      MONGO_INITDB_DATABASE: chat-db
    volumes:
      - mongo-data:/data/db
      - ./chat-service/src/repositories/mongo/mongo-keyfile:/etc/mongo-keyfile:ro
    networks:
      - backend-net

volumes:
  mongo-data:

networks:
  backend-net:
````

---
# MongoDB Replica Set Setup (Manual Initialization)

## 1. Create Keyfile
```bash
cd repositories/mongo
openssl rand -base64 756 > mongo-keyfile
chmod 400 mongo-keyfile

## 2. Start MongoDB Container

Run the following command to start MongoDB:

```bash
docker compose up -d mongo
```

---

## 3. Connect to Mongo Shell

Connect to the running MongoDB container:

```bash
docker exec -it chat-app-backend-mongo-1 mongosh -u root -p --authenticationDatabase admin
```

Password: `root123`

---

## 4. Switch to Your Database

```javascript
use chat-db
```

---

## 5. Initialize the Replica Set

```javascript
rs.initiate({
  _id: "rs0",
  version: 1,
  members: [
    { _id: 0, host: "localhost:27017" }
  ]
});
```

---

## 6. Check Replica Set Status

```javascript
rs.status()
```

Expected output:

* `myState: 1` → PRIMARY
* `ok: 1` → successful initialization

---

## 7. MongoDB Connection URL

Use this URL in your application:

```
mongodb://root:root123@localhost:27017/chat-db?authSource=admin&replicaSet=rs0
```

---

## 8. Notes

* **Keyfile** is only required for secure multi-node replica sets. For a single-node setup, it is optional.
* Warnings like `transparent_hugepage` and `vm.max_map_count` are informational and safe for development.
* `--bind_ip_all` allows external applications to connect to MongoDB.

---

## 9. Optional: Manual Restart

If you need to restart the container:

```bash
docker compose restart mongo
```

---

```

---


```
