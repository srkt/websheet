import { Column } from "./column";

export class Row {

    columns: Array<Column>

    /**
     *
     */
    constructor(columns: Array<Column>) {
        this.columns  = columns;
    }
}