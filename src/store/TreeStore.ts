export type TreeNodeId = string | number;

export interface TreeNodeBase {
  id: TreeNodeId;
  parent: TreeNodeId | null;
  [key: string]: unknown;
}

export class TreeStore<TItem extends TreeNodeBase> {
  private items: TItem[];
  private readonly byId: Map<TreeNodeId, TItem>;
  private readonly indexById: Map<TreeNodeId, number>;
  private readonly childrenIdsByParent: Map<TreeNodeId | null, TreeNodeId[]>;

  constructor(initialItems: TItem[]) {
    this.items = [...initialItems];
    this.byId = new Map<TreeNodeId, TItem>();
    this.indexById = new Map<TreeNodeId, number>();
    this.childrenIdsByParent = new Map<TreeNodeId | null, TreeNodeId[]>();

    for (let index = 0; index < this.items.length; index += 1) {
      const item = this.items[index]!;
      this.byId.set(item.id, item);
      this.indexById.set(item.id, index);
      const children = this.childrenIdsByParent.get(item.parent);
      if (children) {
        children.push(item.id);
      } else {
        this.childrenIdsByParent.set(item.parent, [item.id]);
      }
    }
  }

  /** Возвращает текущий список элементов в хранилище. */
  public getAll(): TItem[] {
    return this.items;
  }

  /** Возвращает элемент по id или undefined, если элемент не найден. */
  public getItem(id: TreeNodeId): TItem | undefined {
    return this.byId.get(id);
  }

  /** Возвращает только прямых дочерних элементов для указанного id. */
  public getChildren(id: TreeNodeId): TItem[] {
    const childrenIds = this.childrenIdsByParent.get(id);
    if (!childrenIds || childrenIds.length === 0) {
      return [];
    }

    const result: TItem[] = [];
    for (const childId of childrenIds) {
      const child = this.byId.get(childId);
      if (child) {
        result.push(child);
      }
    }
    return result;
  }

  /** Возвращает всех потомков элемента (дети, внуки и глубже). */
  public getAllChildren(id: TreeNodeId): TItem[] {
    const result: TItem[] = [];
    const queue: TreeNodeId[] = [...(this.childrenIdsByParent.get(id) ?? [])];
    let head = 0;

    while (head < queue.length) {
      const currentId = queue[head]!;
      head += 1;

      const current = this.byId.get(currentId);
      if (current) {
        result.push(current);
      }

      const nestedChildren = this.childrenIdsByParent.get(currentId);
      if (nestedChildren && nestedChildren.length > 0) {
        queue.push(...nestedChildren);
      }
    }

    return result;
  }

  /** Возвращает цепочку родителей от текущего элемента до корня включительно. */
  public getAllParents(id: TreeNodeId): TItem[] {
    const result: TItem[] = [];
    let current = this.byId.get(id);

    while (current) {
      result.push(current);
      if (current.parent === null) {
        break;
      }
      current = this.byId.get(current.parent);
    }

    return result;
  }

  /** Добавляет новый элемент и обновляет внутренние индексы. */
  public addItem(newItem: TItem): void {
    this.items.push(newItem);
    this.byId.set(newItem.id, newItem);
    this.indexById.set(newItem.id, this.items.length - 1);

    const children = this.childrenIdsByParent.get(newItem.parent);
    if (children) {
      children.push(newItem.id);
    } else {
      this.childrenIdsByParent.set(newItem.parent, [newItem.id]);
    }
  }

  /** Обновляет существующий элемент и, при необходимости, переносит его к новому родителю. */
  public updateItem(updatedItem: TItem): void {
    const existingItem = this.byId.get(updatedItem.id);
    if (!existingItem) {
      return;
    }

    if (existingItem.parent !== updatedItem.parent) {
      this.removeChildReference(existingItem.parent, updatedItem.id);
      const newParentChildren = this.childrenIdsByParent.get(updatedItem.parent);
      if (newParentChildren) {
        newParentChildren.push(updatedItem.id);
      } else {
        this.childrenIdsByParent.set(updatedItem.parent, [updatedItem.id]);
      }
    }

    const itemIndex = this.indexById.get(updatedItem.id);
    if (itemIndex !== undefined) {
      this.items[itemIndex] = updatedItem;
    }
    this.byId.set(updatedItem.id, updatedItem);
  }

  /** Удаляет элемент и все его дочерние элементы из хранилища. */
  public removeItem(id: TreeNodeId): void {
    const idsToDelete = new Set<TreeNodeId>([id]);
    const queue: TreeNodeId[] = [id];
    let head = 0;

    while (head < queue.length) {
      const currentId = queue[head]!;
      head += 1;

      const childIds = this.childrenIdsByParent.get(currentId);
      if (!childIds) {
        continue;
      }

      for (const childId of childIds) {
        if (!idsToDelete.has(childId)) {
          idsToDelete.add(childId);
          queue.push(childId);
        }
      }
    }

    const rootItem = this.byId.get(id);
    if (rootItem) {
      this.removeChildReference(rootItem.parent, id);
    }

    this.items = this.items.filter((item) => !idsToDelete.has(item.id));
    this.indexById.clear();
    for (let index = 0; index < this.items.length; index += 1) {
      this.indexById.set(this.items[index]!.id, index);
    }

    for (const itemId of idsToDelete) {
      this.byId.delete(itemId);
      this.indexById.delete(itemId);
      this.childrenIdsByParent.delete(itemId);
    }
  }

  /** Удаляет связь дочернего элемента с родителем в индексе childrenIdsByParent. */
  private removeChildReference(parentId: TreeNodeId | null, childId: TreeNodeId): void {
    const children = this.childrenIdsByParent.get(parentId);
    if (!children) {
      return;
    }

    const index = children.indexOf(childId);
    if (index < 0) {
      return;
    }

    children.splice(index, 1);

    if (children.length === 0) {
      this.childrenIdsByParent.delete(parentId);
    }
  }
}
