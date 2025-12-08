import type { StyledDataGridProperties } from "../StyledDataGrid";
import type { WindowTitledProperties } from "../WindowTitled";

import StyledDataGrid from "../StyledDataGrid";
import WindowTitled from "../WindowTitled";

interface WindowTitledDataGridProperties extends StyledDataGridProperties, WindowTitledProperties {}

function WindowTitledDataGrid({
  title,
  rows,
  columns,
  getRowId,
  pageSize,
  left,
  top,
  customGetRowClassName,
  customCssRules,
  width,
  height,
  maxWidth,
  maxHeight,
  onXout,
  onRowDoubleClick,
}: WindowTitledDataGridProperties) {
  return (
    <WindowTitled title={title} top={top} left={left} onXout={onXout}>
      <StyledDataGrid
        width={width}
        height={height}
        maxWidth={maxWidth}
        maxHeight={maxHeight}
        rows={rows}
        columns={columns}
        getRowId={getRowId}
        pageSize={pageSize}
        customGetRowClassName={customGetRowClassName}
        customCssRules={customCssRules}
        onRowDoubleClick={onRowDoubleClick}
      />
    </WindowTitled>
  );
}

export type { WindowTitledDataGridProperties };
export default WindowTitledDataGrid;
