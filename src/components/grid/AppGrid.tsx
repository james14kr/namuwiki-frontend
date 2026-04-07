import React, { forwardRef, useImperativeHandle, useMemo, useRef } from "react";
import type { AgGridReactProps } from "ag-grid-react";
import { AgGridReact } from "ag-grid-react";
import { useTranslation } from "react-i18next";
import { getAgGridLocale } from "@/utils/gridUtil";

function AppGridInner<T>(
  props: AgGridReactProps<T>,
  ref: React.ForwardedRef<AgGridReact<T>>
) {
  const { i18n } = useTranslation();
  const gridRef = useRef<AgGridReact<T>>(null);

  useImperativeHandle(ref, () => gridRef.current as AgGridReact<T>, []);

  const { defaultColDef, ...rest } = props;

  const localeText = useMemo(
    () => getAgGridLocale(i18n.language),
    [i18n.language]
  );
  const gridKey = useMemo(() => `aggrid-${i18n.language}`, [i18n.language]);

  return (
    <AgGridReact<T>
      ref={gridRef}
      key={gridKey}
      localeText={localeText}
      defaultColDef={{
        resizable: true,
        sortable: true,
        filter: true,
        ...defaultColDef,
      }}
      {...rest}
    />
  );
}

const AppGrid = forwardRef(AppGridInner) as <T>(
  props: AgGridReactProps<T> & {
    ref?: React.Ref<AgGridReact<T>>;
  }
) => React.ReactElement;

export default AppGrid;
