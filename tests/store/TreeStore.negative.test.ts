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
});
