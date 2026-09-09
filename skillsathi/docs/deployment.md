# Deployment Guide

This document shows simple steps to run locally (docker-compose) and notes for deploying to free hosts.

---

## Local (Docker Compose)

1. Copy env example:
   ```bash
   cp backend/.env.example backend/.env
   # Edit backend/.env: set JWT_SECRET and HF_API_TOKEN if available
