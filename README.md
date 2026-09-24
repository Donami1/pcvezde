<div align="center">

# 🎮 ПК Везде

### Аренда игровых ПК на дом

Лендинг, каталог конфигураций, личный кабинет клиента и админ-панель для сервиса аренды
игровых компьютеров с доставкой. Заявки с сайта приходят в Telegram.

<br/>

[![Next.js 16](https://img.shields.io/badge/Next.js%2016-black?logo=next.js&logoColor=white)](#)
[![React 19](https://img.shields.io/badge/React%2019-61dafb?logo=react&logoColor=black)](#)
[![TypeScript 5](https://img.shields.io/badge/TypeScript%205-3178c6?logo=typescript&logoColor=white)](#)
[![Tailwind CSS 4](https://img.shields.io/badge/Tailwind%20CSS%204-38bdf8?logo=tailwindcss&logoColor=black)](#)
[![SQLite](https://img.shields.io/badge/SQLite-003b57?logo=sqlite&logoColor=white)](#)
[![SQLCipher](https://img.shields.io/badge/SQLCipher-5b21b6?logo=sqlite&logoColor=white)](#)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle%20ORM-c5f74f?logo=drizzle&logoColor=black)](#)

<br/>

[🚀 Быстрый старт](#-быстрый-старт) ·
[🛠 Админ-панель](#-админ-панель) ·
[🔐 Безопасность](#-безопасность) ·
[☁️ Деплой на VPS](#-деплой-на-vps)

</div>

---

## ⚡ Возможности

<div align="center">

| <div align="center">🏠</div> | <div align="center">🗺️</div> | <div align="center">👤</div> |
|:---:|:---:|:---:|
| <b>Лендинг + каталог</b><br/>Главная с играми, отзывы и FAQ,<br/>каталог ПК и карточка каждой конфигурации | <b>Форма заявки с картой</b><br/>Выбор адреса на Яндекс.Картах или 2ГИС,<br/>уведомление о заявке в Telegram | <b>Личный кабинет</b><br/>Регистрация по телефону и паролю,<br/>статусы своих заявок |

| <div align="center">🛠️</div> | <div align="center">🎨</div> | <div align="center">🖼️</div> |
|:---:|:---:|:---:|
| <b>Админ-панель</b><br/>Заявки со статусами, каталог ПК,<br/>свои фото, отзывы и FAQ | <b>Кастомизация без программиста</b><br/>Название, слоган, SEO, контакты и цветовая<br/>тема меняются из админки и применяются сразу | <b>Свои фото конфигураций</b><br/>Загрузка изображений прямо из админки<br/>(JPG/PNG/WebP/GIF, до 8 МБ) |

</div>

---

## 🧰 Стек

<div align="center">

<table style="background:#161b22;border:1px solid #30363d;border-radius:12px;padding:10px 18px;display:inline-block;">
<tr>
<td style="padding:8px 18px;"><b><span style="color:#a855f7">Frontend</span></b><br/>Next.js 16 · React 19 ·<br/>Tailwind CSS 4 · TS</td>
<td style="padding:8px 18px;"><b><span style="color:#a855f7">Backend</span></b><br/>Next.js Route Handlers<br/>Server Actions</td>
<td style="padding:8px 18px;"><b><span style="color:#a855f7">База данных</span></b><br/>SQLite + SQLCipher<br/>Drizzle ORM</td>
<td style="padding:8px 18px;"><b><span style="color:#a855f7">Интеграции</span></b><br/>Telegram Bot API<br/>Яндекс.Карты / 2ГИС</td>
</tr>
</table>

</div>

### Ключевые решения

- **База в одном зашифрованном файле** — SQLCipher, драйвер `better-sqlite3-multiple-ciphers`.
- **Шифрование ПДн клиентов** на уровне приложения (AES-256-GCM, телефон дополнительно —
  детерминированно, чтобы работал логин по номеру).
- **JWT-сессии в cookie** (`jose`) — отдельные для админа и клиентов; пароли в bcrypt.
- **Авто-генерируемые секреты** — `AUTH_SECRET`, ключ БД и пароль админки создаются при первом
  запуске и хранятся в `data/secrets.json` (права 600, папка в `.gitignore`). Без Docker и env-возни.

---

## 🚀 Быстрый старт

```bash
npm install

# 1. Создать .env из примера
cp .env.example .env   # Windows: copy .env.example .env

# 2. Запуск — секреты сгенерируются автоматически при первом старте
npm run dev
```

Откройте **http://localhost:3000** — демо-данные можно наполнить командой `npm run db:seed`.

> 💡 Секреты приоритетно берутся из env (`AUTH_SECRET`, `DATABASE_ENCRYPTION_KEY`, `ADMIN_PASSWORD`),
> если не заданы — генерируются при первом запуске в `data/secrets.json`.

---

## 🛠 Админ-панель

<div align="center">

| <div align="center">📍</div> | <div align="center">🔑</div> |
|:---:|:---:|
| Адрес: **`http://localhost:3000/admin`** | Dev-пароль по умолчанию: **`admin123`** |

</div>

| Раздел | Что умеет |
| --- | --- |
| **Заявки** (`/admin/dashboard`) | Изменить статус, удалить, просмотр заявок и данных клиентов |
| **Конфигурации** (`/admin/configs`) | Добавить / отредактировать / скрыть / удалить, загрузить своё фото |
| **Склад ПК** (`/admin/units`) | Учёт наличия конкретных компьютеров, связь с конфигурациями |
| **Отзывы и FAQ** (`/admin/content`) | Контент главной страницы |
| **Настройки** (`/admin/settings`) | Название, слоган, SEO, контакты, цветовая тема 🎨 **и смена пароля админки** |

Пароль можно сменить в админке: **Настройки → «Пароль админки»** (хэш bcrypt, обновляет
`data/secrets.json`). `ADMIN_PASSWORD` может быть обычным текстом или bcrypt-хэшем (`$2a$`/`$2b$`/`$2y$`).

---

## 👤 Личный кабинет клиента

| Маршрут | Описание |
| --- | --- |
| `/cabinet/register` | Регистрация по имени, телефону и паролю (пароль — bcrypt) |
| `/cabinet/login` | Вход по номеру телефона |
| `/cabinet` | Список своих заявок со статусами (Новая / Подтверждена / Выполнена / Отменена) |

Заявки, оставленные после входа, автоматически привязываются к аккаунту.

> 🔧 Данные, редактируемые в коде: города — `lib/cities.ts`, бегущая строка игр —
> `components/landing/Games.tsx`, дефолтные отзывы/FAQ — `db/seed.ts`.

---

## 🔐 Безопасность

<div align="center">

| <div align="center">🔒</div> | <div align="center">🧂</div> | <div align="center">🔐</div> |
|:---:|:---:|:---:|
| <b>SQLCipher на уровне файла</b><br/>База нечитаема без ключа —<br/>даже если файл утёк | <b>Двойное шифрование ПДн</b><br/>Телефон и имя — AES-256-GCM;<br/>ключ выводится из `AUTH_SECRET` | <b>bcrypt + JWT</b><br/>Пароли хэшируются, сессии —<br/>подписанные cookie (7 дней) |

</div>

**Важно:** не меняйте `AUTH_SECRET` и `DATABASE_ENCRYPTION_KEY` после того, как в БД появились
данные — это сделает существующую базу и сохранённые ПДн/сессии нечитаемыми.

---

## 🌍 Переменные окружения

| Переменная | Обязательно | Описание |
| --- | --- | --- |
| `DATABASE_FILE` | нет | Путь к SQLite-файлу (по умолчанию `./data/pcvezde.db`) |
| `ADMIN_PASSWORD` | нет | Пароль админки (иначе: dev — `admin123`, prod — генерируется) |
| `AUTH_SECRET` | нет | Подпись cookie + ключ шифрования ПДн (иначе автогенерация) |
| `DATABASE_ENCRYPTION_KEY` | нет | Ключ SQLCipher, hex 64 символа (иначе автогенерация) |
| `TELEGRAM_BOT_TOKEN` | нет | Токен бота от @BotFather |
| `TELEGRAM_CHAT_ID` | нет | Chat ID для уведомлений о заявках |
| `NEXT_PUBLIC_YANDEX_MAPS_KEY` | нет | Ключ Яндекс.Карт для выбора адреса |
| `NEXT_PUBLIC_2GIS_KEY` | нет | Ключ 2ГИС для выбора адреса |

Без ключей карт поле адреса — обычный текст. Без Telegram заявки сохраняются в БД и видны в админке,
уведомления просто не отправляются. Контакты/тексты сайта настраиваются из админки и живут в БД.

### 🗺️ Ключи карт (бесплатные)

- **Яндекс.Карты** → [developer.tech.yandex.ru/services](https://developer.tech.yandex.ru/services), продукт «JavaScript API и HTTP-геокодер» → ключ в `NEXT_PUBLIC_YANDEX_MAPS_KEY`.
- **2ГИС** → [catalog.api.2gis.com](https://catalog.api.2gis.com), проект → ключ web-gis → в `NEXT_PUBLIC_2GIS_KEY`.

Достаточно одного из них.

### 🤖 Telegram-уведомления

1. Создайте бота у @BotFather → токен в `TELEGRAM_BOT_TOKEN`.
2. Напишите боту `/start`.
3. Chat id: `https://api.telegram.org/bot<ТОКЕН>/getUpdates` → первый `chat.id` → в `TELEGRAM_CHAT_ID`.
4. Перезапустите сервер — на каждую заявку бот присылает сообщение.

---

## 🗄️ База данных и скрипты

```bash
npm run db:generate  # миграции по схеме (папка drizzle/)
npm run db:migrate   # применить миграции через зашифрованное соединение
npm run db:seed      # демо-данные (конфигурации, склад ПК, отзывы, FAQ)
npm run lint         # eslint
npm run build        # продакшен-сборка
npm start            # запуск собранного приложения
```

> ⚠️ БД зашифрована (SQLCipher) — `db:push` недоступен, только `db:generate` + `db:migrate`.

---

## ☁️ Деплой на VPS

```bash
npm ci
npm run build
npm run db:seed      # один раз (демо-данные), можно не запускать

# секреты сгенерируются в data/secrets.json при первом запуске
# пароль админки в prod печатается в консоль при первом старте,
# затем его можно сменить в админке /admin/settings -> «Пароль админки»

PORT=3000 npm start  # если за nginx — internal port
```

<details>
<summary><b>Известный нюанс с типами драйвера</b> (развернуть)</summary>

Драйвер `better-sqlite3-multiple-ciphers` публикует декларацию типов обходом `exports` — типы
подключаются правкой `node_modules/better-sqlite3-multiple-ciphers/package.json`: добавить
`"types": "./index.d.ts"` в блок `"."` блока `exports`. Если после `npm ci` типы перестали
резолвиться — повторите правку. В `next.config.ts` драйвер вынесен в `serverExternalPackages`,
чтобы Turbopack не бандлил нативный `.node`.

</details>

### Держим процесс живым — pm2

```bash
npm i -g pm2
pm2 start npm --name pcvezde -- start
pm2 save
pm2 startup
```

### 📥 Бэкап

База лежит в `data/` — копируйте **всю папку** с `secrets.json` (без ключа зашифрованная база
не читается). В режиме WAL копируйте и `-wal`, и `-shm`, либо делайте `VACUUM INTO`.
Загруженные фото — `public/uploads/` (в `.gitignore`), включайте в бэкап тоже.

### Nginx (пример)

```nginx
server {
    server_name pcvezde.ru www.pcvezde.ru;
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
    }
}
```

---

## 📁 Структура

```
app/            страницы (лендинг, каталог, карточка ПК, админка, личный кабинет, API)
components/     UI-компоненты (шапка, формы, секции лендинга, карта, админ-формы)
db/             схема БД (Drizzle), клиент SQLite, сид
lib/            данные, форматирование, авторизация, настройки, темы, Telegram
public/images/configs/    базовые изображения конфигураций
public/uploads/configs/   загруженные фото конфигураций (из админки)
```

---

<div align="center">

**ПК Везде** — аренда игровых ПК с прокачанным бэком: шифрование данных, автосекреты и кастомизация
без программиста.

</div>