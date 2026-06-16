#!/bin/bash
# ============================================
# AgentWatch Deployment Script
# Replace YOUR_TOKEN below with your actual GitHub token
# Then run: bash deploy.sh
# ============================================

TOKEN="YOUR_TOKEN_HERE"
REPO_NAME="agent-cost-monitor"
USER="mamoor123"
DIR="/c/Users/Lenovo/Desktop/agent-cost-monitor"

echo "Step 1: Creating GitHub repo..."
curl -s -X POST https://api.github.com/user/repos \
  -H "Authorization: token $TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  -d "{\"name\":\"$REPO_NAME\",\"auto_init\":false}"

echo ""
echo "Step 2: Pushing code..."
cd "$DIR"
git remote set-url origin "https://$USER:$TOKEN@github.com/$USER/$REPO_NAME.git"
git push -u origin master

echo ""
echo "Step 3: Enabling GitHub Pages..."
curl -s -X POST "https://api.github.com/repos/$USER/$REPO_NAME/pages" \
  -H "Authorization: token $TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  -d '{"source":{"branch":"master","path":"/"}}'

echo ""
echo "DONE! Your site will be at: https://$USER.github.io/$REPO_NAME/"
