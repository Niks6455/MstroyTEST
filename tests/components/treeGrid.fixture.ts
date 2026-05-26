import type { ColDef } from 'ag-grid-community';
import type { GridRow } from '@/composables/useTreeGrid';

export const mockColumns: ColDef<GridRow>[] = [
  { headerName: '№ п/п', minWidth: 100, maxWidth: 100 },
  { headerName: 'Категория', field: 'category', minWidth: 300 },
  { headerName: 'Наименование', field: 'label', flex: 1 }
];

export const mockRowData: GridRow[] = [
  { id: 1, parent: null, label: 'Айтем 1', path: ['1'], category: 'Группа' },
  { id: 3, parent: 1, label: 'Айтем 3', path: ['1', '3'], category: 'Элемент' }
];

export const mockGetDataPath = (data: GridRow): string[] => data.path;
