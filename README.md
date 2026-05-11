cd /apps/stik-flow.notifier

APP="http"
APP_PATH="build/entrypoints/http.js"

MAX_MEMORY="4096"
git reset --hard HEAD
npm i
npm run build
cp .env build/

pm2 delete $APP 2>/dev/null

pm2 start $APP \
    --name "$SERVICE1_NAME" \
    --max-memory-restart 1G \
    --node-args="--max-old-space-size=$MAX_MEMORY" \


pm2 startup
pm2 save
