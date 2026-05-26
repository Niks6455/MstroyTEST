import { describe, expect, it } from 'vitest';
import { TreeStore } from '@/store/TreeStore';
import { createItems, type TestItem } from '@tests/store/treeStore.fixture';

describe('TreeStore - положительные сценарии', () => {
  it('getAll возвращает все элементы', () => {
    const items = createItems();
    const store = new TreeStore(items);

    expect(store.getAll()).toEqual(items);
    expect(store.getAll()).toHaveLength(8);
  });

  it('getItem возвращает элемент по id', () => {
    const store = new TreeStore(createItems());

    expect(store.getItem('91064cee')?.label).toBe('Айтем 2');
  });

  it('getChildren возвращает только прямых детей', () => {
    const store = new TreeStore(createItems());

    expect(store.getChildren(1).map((item) => item.id)).toEqual(['91064cee', 3]);
    expect(store.getChildren(4).map((item) => item.id)).toEqual([7, 8]);
  });

  it('getAllChildren возвращает всех потомков', () => {
    const store = new TreeStore(createItems());

    expect(store.getAllChildren(1).map((item) => item.id)).toEqual(['91064cee', 3, 4, 5, 6, 7, 8]);
    expect(store.getAllChildren('91064cee').map((item) => item.id)).toEqual([4, 5, 6, 7, 8]);
  });

  it('getAllParents возвращает путь к корню в правильном порядке', () => {
    const store = new TreeStore(createItems());

    expect(store.getAllParents(7).map((item) => item.id)).toEqual([7, 4, '91064cee', 1]);
    expect(store.getAllParents(1).map((item) => item.id)).toEqual([1]);
  });

  it('addItem добавляет элемент и обновляет индексы', () => {
    const store = new TreeStore(createItems());
    const newItem: TestItem = {
      id: 'new-node',
      parent: 3,
      label: 'Новый узел'
    };

    store.addItem(newItem);

    expect(store.getItem('new-node')).toEqual(newItem);
    expect(store.getChildren(3).map((item) => item.id)).toEqual(['new-node']);
    expect(store.getAll()).toHaveLength(9);
  });

  it('updateItem обновляет данные и переносит элемент к новому родителю', () => {
    const store = new TreeStore(createItems());
    const updated: TestItem = { id: 5, parent: 3, label: 'Айтем 5 обновлен' };

    store.updateItem(updated);

    expect(store.getItem(5)).toEqual(updated);
    expect(store.getChildren('91064cee').map((item) => item.id)).toEqual([4, 6]);
    expect(store.getChildren(3).map((item) => item.id)).toEqual([5]);
  });

  it('removeItem удаляет элемент и все его потомки', () => {
    const store = new TreeStore(createItems());

    store.removeItem('91064cee');

    expect(store.getAll().map((item) => item.id)).toEqual([1, 3]);
    expect(store.getChildren(1).map((item) => item.id)).toEqual([3]);
  });
});
