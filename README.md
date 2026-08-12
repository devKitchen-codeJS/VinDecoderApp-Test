# VIN Decoder

SPA для розшифровки VIN-кодів автомобілів через відкрите API [NHTSA vPIC](https://vpic.nhtsa.dot.gov/api/).

## Стек

- React 19 + TypeScript
- Vite
- Tailwind CSS 4 (через `@tailwindcss/vite`, дизайн-токени в `src/styles/global.css`)
- react-router-dom (маршрутизація без бекенду, `BrowserRouter`)
- localStorage — зберігання історії останніх 3 розшифровок (без бекенду)

## Запуск

```bash
npm install
npm run dev       # dev-сервер, http://localhost:5173
npm run build     # прод-збірка у dist/
npm run preview   # локальний перегляд прод-збірки
npm run lint       # oxlint
```

## Структура

```
src/
├── api/            # тонкий шар над NHTSA vPIC API (decodeVin, getVehicleVariablesList)
├── components/     # переиспользуемые UI-блоки
│   ├── VinForm/         — форма вводу VIN з валідацією
│   ├── VinHistory/      — список останніх 3 запитів
│   ├── DecodeResults/   — список Variable/Value з непустими Value
│   └── VariableCard/    — рядок у списку /variables
├── pages/
│   ├── HomePage/            — "/"
│   ├── VariablesPage/       — "/variables"
│   └── VariableDetailsPage/ — "/variables/:variableId"
├── hooks/
│   ├── useVinDecoder.ts     — стан розшифровки, валідація, історія
│   └── useLocalStorage.ts   — узагальнений хук для persist-стану
├── types/vin.ts     # типи відповідей vPIC API та історії
├── utils/vinValidation.ts  # валідація VIN (порожнє поле, довжина, заборонені символи)
└── styles/global.css       # `@import "tailwindcss"` + дизайн-токени (`@theme`) + базові стилі
```

Стилі компонентів — утилітарні класи Tailwind прямо в JSX (окремих `*.css`-файлів
на компонент немає, тільки спільні токени та `.card` у `global.css`).

## Реалізовані вимоги

- Форма підтримує валідацію: непорожнє поле, максимум 17 символів, лише допустимі
  символи VIN (латинські літери, крім I/O/Q, та цифри).
- Помилки валідації та повідомлення з поля `Message` відповіді API виводяться
  безпосередньо в інтерфейсі (`role="alert"`).
- Історія останніх 3 унікальних VIN зберігається у `localStorage` і дозволяє
  повторно відобразити результат без нового запиту до API.
- Сторінка `/variables` показує повний список змінних vPIC з пошуком за назвою;
  `/variables/:variableId` — опис конкретної змінної.
- Верстка адаптивна в діапазоні 420–1440px, без CSS-фреймворків, з увагою до
  семантики (`header`/`nav`/`main`/`footer`, `dl`/`dt`/`dd` для пар Variable/Value,
  `label`+`input`, `role="alert"`).
