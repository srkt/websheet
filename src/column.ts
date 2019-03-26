import { ColumnOptions } from "./columnOptions";

export type dataType = "number" | "string" | "date" | "boolean";

export interface IColumn {
    filterable?: boolean;
    draggable?: boolean;
    sortable?: boolean;
    template?:string;
    groupable?: boolean;
    headerStyles?:Object;
    elementStyles?:Object;
    field: string;
    dataType: dataType;
    name?: string;
    readonly:boolean;
    locked:boolean;
}

