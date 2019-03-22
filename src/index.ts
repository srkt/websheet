import { WebSheet } from "./Websheet";
import { SheetOptions } from "./SheetOptions";
import { IColumn } from "./column";

const sheetOptions = new SheetOptions();
sheetOptions.Columns = [
    {field:'id', dataType:'number',headerStyles:{'color':'red','backgroundColor':'blue'}},
    {field:'name', dataType:'string',headerStyles:{'fontFamily':'verdana','fontSize':'20px','backgroundColor':'whitesmoke'}},
    {field:'desc', dataType:'string'},
    {field:'pm', dataType:'string'},
    {field:'start', dataType:'date'},
    {field:'finish', dataType:'date'}
];
sheetOptions.dataOptions = {
    read:{
        url:'data.json',
        type:'json'
    }
};
debugger;
const ws = new WebSheet("#app",sheetOptions);


console.log(ws.options.Columns);