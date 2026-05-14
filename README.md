# Cкрипт запуска на проде через pm2 (base)
mkdir /apps
mkdir /apps/auth_page
cd /apps/auth_page

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

# Dev запуск 
## В папке infrastructure находится файл docker-compose.dev.yaml который запускает mongo
## Необходимо создать и заполнить файл .env по образцу src/libs/config/appConfig.ts
## В корневой папке, после инстроляции проекта сервер в dev режиме запускается скриптом yarn/npm server:dev 
## Также в корневой папке находится клиент на React в папке client, также необходимо проинстолировать и создать и заполнить файл client/src/appconfig.ts по образцу --> export default {backendUrl: "http://localhost:порт_бэкенда",} далее проинсталировать и запустить проект

# Уже предсозданный юзер с ролью Admin:
## email: admin@admin.admin
## password: password