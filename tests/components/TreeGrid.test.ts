import type { ColDef } from 'ag-grid-community';
import type { VueWrapper } from '@vue/test-utils';
import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { GridRow } from '@/composables/useTreeGrid';
import {
  mockColumns,
  mockGetDataPath,
  mockRowData
} from '@tests/components/treeGrid.fixture';

interface AgGridStubProps {
  columnDefs: ColDef<GridRow>[];
  rowData: GridRow[];
  treeData?: boolean;
  groupDisplayType?: string;
  groupDefaultExpanded?: number;
  getDataPath?: (data: GridRow) => string[];
  domLayout?: string;
}

const useTreeGridMock = vi.fn();

vi.mock('ag-grid-enterprise', () => ({}));

vi.mock('ag-grid-vue3', () => {
  const { defineComponent } = require('vue');

  return {
    AgGridVue: defineComponent({
      name: 'AgGridVue',
      props: {
        columnDefs: { type: Array, default: () => [] },
        rowData: { type: Array, default: () => [] },
        treeData: Boolean,
        groupDisplayType: String,
        groupDefaultExpanded: Number,
        getDataPath: Function,
        domLayout: String
      },
      template: '<div data-testid="ag-grid-stub" />'
    })
  };
});

vi.mock('@/composables/useTreeGrid', () => ({
  useTreeGrid: () => useTreeGridMock()
}));

import TreeGrid from '@/components/TreeGrid.vue';

const mountTreeGrid = () => mount(TreeGrid);

const getGridPropsFrom = (wrapper: VueWrapper): AgGridStubProps =>
  wrapper.findComponent({ name: 'AgGridVue' }).props() as AgGridStubProps;

const getGridProps = (): AgGridStubProps => getGridPropsFrom(mountTreeGrid());

const setupDefaultMock = () => {
  useTreeGridMock.mockReturnValue({
    columns: mockColumns,
    rowData: mockRowData,
    getDataPath: mockGetDataPath
  });
};

describe('TreeGrid - положительные сценарии', () => {
  beforeEach(() => {
    useTreeGridMock.mockReset();
    setupDefaultMock();
  });

  it('монтируется и рендерит обёртку таблицы', () => {
    const wrapper = mountTreeGrid();

    expect(wrapper.find('.ag-theme-quartz.table-wrapper').exists()).toBe(true);
    expect(wrapper.find('[data-testid="ag-grid-stub"]').exists()).toBe(true);
  });

  it('передаёт в AgGrid три колонки и данные из useTreeGrid', () => {
    const props = getGridProps();

    expect(useTreeGridMock).toHaveBeenCalledTimes(1);
    expect(props.columnDefs).toHaveLength(3);
    expect(props.rowData).toEqual(mockRowData);
  });

  it('включает режим дерева и раскрывает все уровни', () => {
    const props = getGridProps();

    expect(props.treeData).toBe(true);
    expect(props.groupDisplayType).toBe('custom');
    expect(props.groupDefaultExpanded).toBe(-1);
    expect(props.domLayout).toBe('autoHeight');
  });

  it('передаёт функцию getDataPath', () => {
    const props = getGridProps();

    expect(props.getDataPath).toBe(mockGetDataPath);
  });
});

describe('TreeGrid - отрицательные сценарии', () => {
  beforeEach(() => {
    useTreeGridMock.mockReset();
  });

  it('не падает при монтировании с пустым rowData', () => {
    useTreeGridMock.mockReturnValue({
      columns: mockColumns,
      rowData: [],
      getDataPath: mockGetDataPath
    });

    expect(() => mountTreeGrid()).not.toThrow();
  });

  it('передаёт пустой rowData в AgGrid и сохраняет колонки', () => {
    useTreeGridMock.mockReturnValue({
      columns: mockColumns,
      rowData: [],
      getDataPath: mockGetDataPath
    });

    const wrapper = mountTreeGrid();
    const props = getGridPropsFrom(wrapper);

    expect(wrapper.find('[data-testid="ag-grid-stub"]').exists()).toBe(true);
    expect(props.rowData).toEqual([]);
    expect(props.columnDefs).toHaveLength(3);
  });

  it('монтируется с пустым списком колонок', () => {
    useTreeGridMock.mockReturnValue({
      columns: [],
      rowData: [],
      getDataPath: mockGetDataPath
    });

    const props = getGridProps();

    expect(props.columnDefs).toEqual([]);
    expect(props.rowData).toEqual([]);
  });

  it('сохраняет настройки дерева даже без строк', () => {
    useTreeGridMock.mockReturnValue({
      columns: mockColumns,
      rowData: [],
      getDataPath: mockGetDataPath
    });

    const props = getGridProps();

    expect(props.treeData).toBe(true);
    expect(props.groupDefaultExpanded).toBe(-1);
    expect(props.getDataPath).toBe(mockGetDataPath);
  });
});
