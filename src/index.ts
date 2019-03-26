import { WebSheet } from "./Websheet";
import { SheetOptions } from "./SheetOptions";
import { IColumn } from "./column";
import DataService from "./WsData";


(async ()=> {

const sheetOptions = new SheetOptions();

const columns = await DataService.getData('./fieldinfo.json');

console.log(columns);

// sheetOptions.Columns = [
//     {field:'id', dataType:'number',headerStyles:{'color':'red','backgroundColor':'blue'}},
//     {field:'name', dataType:'string',headerStyles:{'fontFamily':'verdana','fontSize':'20px','backgroundColor':'whitesmoke'}},
//     {field:'desc', dataType:'string'},
//     {field:'pm', dataType:'string'},
//     {field:'start', dataType:'date'},
//     {field:'finish', dataType:'date'}
// ];

sheetOptions.Columns = <IColumn[]>columns;

sheetOptions.dataOptions = {
    read:{
        url:'MOCK_DATA.json',
        type:'json'
    }
};

const ws = new WebSheet("#app",sheetOptions);

async function getfields(){
    const fields = await DataService.getData('fieldinfo.json',null);
    return fields;
} 

console.log(ws.options.Columns);

})();