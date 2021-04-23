#!/bin/bash

npm install
npm run build
docker build . -t micro-container:v1.0
