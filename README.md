# MstroyTEST

Тестовое задание MStroy: `TreeStore` + Vue-таблица на AG Grid.

## Запуск

Требования: Node.js (рекомендуется LTS).

```bash
npm install
npm run dev
```

### Команды

```bash
npm run typecheck
npm run test
npm run build
npm run preview
```

## TreeStore

Индексы на `Map` для быстрых операций без полного обхода массива на чтение.

| Метод | Описание |
|-------|----------|
| `getAll()` | Копия текущего списка элементов |
| `getItem(id)` | Элемент по `id` |
| `getChildren(id)` | Прямые дочерние элементы |
| `getAllChildren(id)` | Все потомки |
| `getAllParents(id)` | Цепочка от узла к корню (порядок важен) |
| `addItem(item)` | Добавление; игнорируется при дубликате `id` или несуществующем `parent` |
| `updateItem(item)` | Обновление; перенос отклоняется, если `parent` — сам узел, его потомок или несуществующий id |
| `removeItem(id)` | Удаление поддерева; swap-remove в массиве без `filter` |

## Тесты

```bash
npm test
npm test nameTest...
```

- **TreeStore** — позитивные и отрицательные сценарии (`tests/store/`): CRUD, порядок `getAllParents`, защита от дубликатов и циклов.
- **TreeGrid** — `tests/components/TreeGrid.test.ts`: stub `AgGridVue`, мок `useTreeGrid`; проверяется передача props (`treeData`, колонки, пустые данные).

Тесты компонента не поднимают реальную сетку — только контракт Vue-обёртки.
