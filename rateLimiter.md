# Two-Layer Rate Limiter Design Guide

## Overview

This is an important point in designing two-layer rate limiters. Let's break it down.

## 1️⃣ The Two Layers

### 1. Global Burst Limiter (`globalLimiter`)
- **Short duration** (e.g., 1 second)
- **Protects against** sudden spikes (burst requests)
- **Fast fail** if exceeded

### 2. Per-Service Sustained Limiter (`serviceLimiter`)
- **Longer duration** (e.g., 1 minute)
- **Controls** overall traffic per service over time
- **Can have** weighted requests

## 2️⃣ Which One Should Have More Points?

**`serviceLimiter` (per-service) should usually have more points than the `globalLimiter`.**

### Reasoning

| Limiter | Points | Duration | Purpose |
|---------|--------|----------|---------|
| **Global** | Small (e.g., 200) | 1s | Prevent bursts, sudden flood of requests |
| **Service** | Larger (e.g., 1000) | 60s | Allow sustained traffic per service over a longer period |

- The **global limiter** is only meant to stop sudden spikes, so it doesn't need high points.
- The **service limiter** handles the "normal" sustained traffic that your services expect, so it needs more points to accommodate legitimate requests.

## 3️⃣ Example Scenario

Suppose a client sends **50 requests per second**:

- **Global limiter**: 200 points per second → 50 requests × 1 point = 50 points ✅ **allowed**
- **Service limiter**: 1000 points per minute → 50 requests/sec × 60 sec = 3000 points ❌ **would exceed** → starts blocking after sustained traffic

### Effect
- **Burst** of 50 requests in 1 second is fine (global allows it)
- If client **keeps sending** 50 requests/sec for a whole minute, the service limiter kicks in to prevent abuse

## 4️⃣ Rule of Thumb

- **Short-window limiter** (burst protection) → **smaller points**
- **Longer-window limiter** (sustained/service protection) → **larger points**

```
Global limiter = "quick shield"
Service limiter = "sustained firewall"
```

