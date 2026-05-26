import { computed } from 'vue';
import type { ColDef, ValueGetterParams } from 'ag-grid-community';
import { TreeStore } from '@/store/TreeStore';
import { demoItems, type DemoItem } from '@/mocks/items';

const CATEGORY_COL_MIN_WIDTH = 300;

export interface GridRow extends DemoItem {
  path: string[];
  category: 'Группа' | 'Элемент';
}

const categoryClass: NonNullable<ColDef<GridRow>['cellClass']> = ({ data }) =>
  data?.category === 'Группа' ? 'group-highlight' : 'item-muted';

const columns: ColDef<GridRow>[] = [
  {
    headerName: '№ п/п',
    minWidth: 100,
    maxWidth: 100,
    valueGetter: (params: ValueGetterParams<GridRow>) => (params.node?.rowIndex ?? 0) + 1
  },
  {
    headerName: 'Категория',
    field: 'category',
    minWidth: CATEGORY_COL_MIN_WIDTH,
    showRowGroup: true,
    cellRenderer: 'agGroupCellRenderer',
    cellClass: categoryClass,
    cellRendererParams: {
      suppressCount: true
    }
  },
  {
    headerName: 'Наименование',
    field: 'label',
    flex: 1,
    cellClass: categoryClass
  }
];

// Адаптация исходных данных для AG Grid treeData
const toGridRow = (store: TreeStore<DemoItem>, item: DemoItem): GridRow => {
  const path = store
    .getAllParents(item.id)
    .slice()
    .reverse()
    .map((node) => String(node.id));
  const category = store.getChildren(item.id).length > 0 ? 'Группа' : 'Элемент';

  return { ...item, path, category };
};

export function useTreeGrid(store: TreeStore<DemoItem> = new TreeStore<DemoItem>(demoItems)) {
  const rowData = computed<GridRow[]>(() => store.getAll().map((item) => toGridRow(store, item)));

  const getDataPath = (data: GridRow): string[] => data.path;

  return {
    columns,
    rowData,
    getDataPath
  };
}
