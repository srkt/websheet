import { IColumn } from "./column";
import { IDataOptions } from "./IDataOptions";

export class SheetOptions{

    public dataOptions:IDataOptions;
    
    private _columnCache:Map<string,IColumn> = new Map();
    filterable:boolean = true;
    Columns:IColumn[] = [];
    
    addColumn(column:IColumn) {
        this.Columns.push(column);

    }

    getColumn(fieldName:string){
        let column = this._columnCache.get(fieldName);
        if(column) {
            return column;
        }



        column = this.Columns.filter(c => c.field === fieldName)[0];

        if(!column) throw new Error("Column with field not found");

        this._columnCache.set(fieldName, column);

        return column;


        // return this._columns.get(name);
    }

    // get Columns(){
    //     return Array.from(this._columns.values());
    // }

}