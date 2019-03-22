import { IColumn } from "./column";

export class Row {

    public columns: Array<IColumn>

    constructor(columns: Array<IColumn>) {
        this.columns  = columns;
        
    }
}
