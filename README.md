### Reports service

**Общий протокол запросов:**

GET /report/{report-name}?param1=val1&param2=val2...

**Параметры:**
- getFile - boolean, если true то скачивает CSV файл, иначе возвращает JSON
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

**Дополнительные параметры для отчётов:**  
*agg-game-data:*
- unit - string enum<hour, day, week, month, year>, период аггрегации

**Пример набора параметров:**  
limit=10&offset=0&sortName=gameId&sortOrder=desc&columnFilters=[{"key":"dateTime","type":"between","value":{"from":"2019-09-18","to":"2019-10-16 23:59:59"}},{"key":"gameId","type":"like","value":"5000"}]
