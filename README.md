# Test service
Представляет собой основу для будущего приложения  
База данных - postgresql  
Аутентификация через jsonwebtoken
## Как запустить
- выполнить файл  ./init.sql в postgresql для инициализации ДБ
- изменить по необходимости config.json
- **npm install**
- **npm start**
## Структура
./components - компоненты системы - логгер, валидатор и т.д.  
./dao - работа с базой данных  
./dao/IDao.js - интерфейс для всех dao  
./middleware - express middlewares  
./routes - express routes  
./schemas - схемы для валидации запросов и данных в формате jsonschema  
./services - сервисы и основная логика приложения  
./test - тесты  

## Запросы

### **Авторизация**

#### Запрос

POST localhost:1999/login

```json
  {
    "login": "test1",
    "password": "test123"
  }
```

#### Ответ

```json
  {
    "success": true,
    "token": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2dpbiI6InRlc3QxIiwiaWF0IjoxNTgzNjA1MTU1LCJleHAiOjE1ODM2MTExNTV9.x_P_DCiIc6d3IRWHOMI2InPM9sP-1lH5t0OAneXB8dg"
  }
```

#### Пример

```curl
  curl --request POST \
  --url http://localhost:1999/login \
  --header 'content-type: application/json' \
  --data '{	"login": "test1",	"password": "test123"}'
```

### **Регистрация**

#### Запрос

POST localhost:1999/users

```json
  {
    "login": "test5",
    "password": "test123",
    "enabled": false
  }
```

#### Ответ

```json
  {
    "success": true,
    "data": {
        "id": "127",
        "login": "test53",
        "enabled": false
    }
  }
```

#### Пример

```curl
  curl --request POST \
  --url http://localhost:1999/users \
  --header 'content-type: application/json' \
  --data '{	"login": "test5",	"password": "test123",	"enabled": false}'
```

### **Изменить юзера**

#### Запрос

PUT localhost:1999/users

```json
  {
    "id": 123,
    "password": "test1234",
    "enabled": false
  }
```

#### Ответ

```json
  {
    "success": true
  }
```

#### Пример

```curl
  curl --request PUT \
  --url http://localhost:1999/users \
  --header 'authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2dpbiI6InRlc3QxIiwiaWF0IjoxNTgzNjA1MTU1LCJleHAiOjE1ODM2MTExNTV9.x_P_DCiIc6d3IRWHOMI2InPM9sP-1lH5t0OAneXB8dg' \
  --header 'content-type: application/json' \
  --data '{"id": 123,	"password": "test1234",	"enabled": false}'
```

### **Список юзеров**

GET localhost:1999/users?param1=val1&param2=val2...

**Параметры:**

- limit - integer, лимит
- offset - integer, сдвиг
- sortName - string, название поля для сортировки
- sortOrder - enum: 'asc' или 'desc'
- columnFilters - Object[] - массив объектов с полями:
  - key - string, поле сортировки
  - type - string, тип фильтра, поддерживает следующие:
    - 'between'
    - 'like' - оператор like
    - 'eq' - ==
    - 'gt' - >
    - 'gteq' - >=
    - 'lt' - <
    - 'lteq' - <=
    - 'nteq' - !=
  - value - string|number|object, значение для сортировки, в случае type=='between', является объектов типа: { from: val1, to: val2 }

**Пример набора параметров:**  
localhost:1999/users?limit=10&offset=1&sortName=id&sortOrder=desc&columnFilters=[{"key":"login","type":"like","value":"test"},{"key":"id","type":"gt","value":"124"}]

#### Пример

```curl
  curl --request GET \
  --url 'http://localhost:1999/users?limit=10&offset=1&sortName=id&sortOrder=desc&columnFilters=%5B%7B%22key%22%3A%22login%22%2C%22type%22%3A%22like%22%2C%22value%22%3A%22test%22%7D%2C%7B%22key%22%3A%22id%22%2C%22type%22%3A%22gt%22%2C%22value%22%3A%22124%22%7D%5D' \
  --header 'authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2dpbiI6InRlc3QxIiwiaWF0IjoxNTgzNjAzOTYwLCJleHAiOjE1ODM2MDk5NjB9.gI93LDKvJkAt3wghKCpOEATGXeCsEsp2F0JqpzH3FsQ' \
```