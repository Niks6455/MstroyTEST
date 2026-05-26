import { describe, expect, it } from 'vitest';
import { TreeStore } from '@/store/TreeStore';
import { createItems, type TestItem } from '@tests/store/treeStore.fixture';

describe('TreeStore - отрицательные сценарии', () => {
  it('getItem возвращает undefined для несуществующего id', () => {
    const store = new TreeStore(createItems());

    expect(store.getItem(123456)).toBeUndefined();
  });

  it('getChildren возвращает пустой массив для узла без детей', () => {
    const store = new TreeStore(createItems());

    expect(store.getChildren(7)).toEqual([]);
  });

  it('getAllChildren возвращает пустой массив для листового узла', () => {
    const store = new TreeStore(createItems());

    expect(store.getAllChildren(8)).toEqual([]);
  });

  it('getAllParents возвращает пустой массив для несуществующего id', () => {
    const store = new TreeStore(createItems());

    expect(store.getAllParents(999)).toEqual([]);
  });

  it('updateItem не делает ничего для несуществующего элемента', () => {
    const store = new TreeStore(createItems());
    const snapshot = store.getAll();
    const missing: TestItem = {
      id: 'missing',
      parent: null,
      label: 'Нет в дереве'
    };

    store.updateItem(missing);

    expect(store.getAll()).toEqual(snapshot);
    expect(store.getItem('missing')).toBeUndefined();
  });

  it('removeItem для несуществующего id не ломает структуру', () => {
    const store = new TreeStore(createItems());
    const before = store.getAll();

    store.removeItem('missing');

    expect(store.getAll()).toEqual(before);
    expect(store.getChildren(1).map((item) => item.id)).toEqual(['91064cee', 3]);
  });

  it('addItem игнорирует элемент с уже существующим id', () => {
    const store = new TreeStore(createItems());
    const duplicate: TestItem = {
      id: 3,
      parent: 1,
      label: 'Дубликат'
    };

    store.addItem(duplicate);

    expect(store.getAll()).toHaveLength(8);
    expect(store.getItem(3)?.label).toBe('Айтем 3');
  });

  it('addItem игнорирует элемент с несуществующим parent', () => {
    const store = new TreeStore(createItems());
    const orphan: TestItem = {
      id: 'orphan',
      parent: 'missing-parent',
      label: 'Сирота'
    };

    store.addItem(orphan);

    expect(store.getItem('orphan')).toBeUndefined();
    expect(store.getAll()).toHaveLength(8);
  });

  it('updateItem не переносит узел к своему потомку', () => {
    const store = new TreeStore(createItems());
    const before = store.getAll();

    store.updateItem({ id: 1, parent: 7, label: 'Айтем 1' });

    expect(store.getAll()).toEqual(before);
    expect(store.getItem(1)?.parent).toBeNull();
  });

  it('updateItem не делает узел родителем самого себя', () => {
    const store = new TreeStore(createItems());

    store.updateItem({ id: 4, parent: 4, label: 'Айтем 4' });

    expect(store.getItem(4)?.parent).toBe('91064cee');
  });

  it('updateItem игнорирует несуществующего parent', () => {
    const store = new TreeStore(createItems());

    store.updateItem({ id: 5, parent: 'ghost', label: 'Айтем 5' });

    expect(store.getItem(5)?.parent).toBe('91064cee');
  });
});
