#!/usr/bin/bash

( cd frontend ; PORT=8000 npm run dev ) & \
( cd backend ; PORT=8001 PRODUCTION=false denon run --allow-env --allow-read --allow-write --allow-net main.ts )
