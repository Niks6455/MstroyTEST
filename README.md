# MstroyTEST
Тестовое задание для MStroy.

## Запуск проекта

Требования: установленный Node.js (рекомендуется LTS-версия).

```bash
npm install
npm run dev
```

После запуска приложение будет доступно по адресу из вывода Vite (обычно `http://localhost:5173`).

### Полезные команды

```bash
npm run typecheck
npm run test
npm run build
npm run preview
```

## Что реализовано

Проект включает:
- `TreeStore` на TypeScript для хранения и операций с деревом;
- Vue-компонент таблицы на базе `ag-grid-vue3` (+ `ag-grid-enterprise` для tree/group функциональности).

## Методы `TreeStore`

Реализованы следующие методы:
- `getAll()` — возвращает текущий список элементов хранилища;
- `getItem(id)` — возвращает элемент по `id`;
- `getChildren(id)` — возвращает прямых дочерних элементов;
- `getAllChildren(id)` — возвращает всех потомков элемента;
- `getAllParents(id)` — возвращает цепочку родителей до корня;
- `addItem(item)` — добавляет новый элемент;
- `updateItem(item)` — обновляет существующий элемент;
- `removeItem(id)` — удаляет элемент вместе со всем его поддеревом.
