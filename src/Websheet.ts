import { SheetOptions } from "./SheetOptions";
import DataService from "./WsData";
import { IColumn } from "./column";
import { ColumnOptionsView } from "./columnOptionsView";

declare global {
  interface Window {
    Websheet: any;
  }
}
declare var document: Document;



export class WebSheet {

  element: HTMLElement;
  data: any[] = [];
  root: DocumentFragment;

  private positionX:number;
  private positionY:number;

  parent:HTMLElement;

  private rootTable:HTMLTableElement;
 
  private self:WebSheet;
   
  get columnCount() {
    return this.options.Columns.length;
  }

  constructor(selector: string, public options?: SheetOptions) {
    if (!selector) throw new Error("invalid selector passed");
    this.self = this;
    this.element = document.querySelector(selector);

    if(!this.element) throw new Error('Unable to find the selector. Please assign proper selector');

    this.element.style.height = this.options.height ? this.options.height : '100%';
    this.element.style.width = this.options.width ? this.options.width : '100%';

    this.parent = this.element.parentElement;
    this.parent.style.overflowY = 'auto';

    this.parent.removeEventListener('scroll',this.getScrollPosition);
    this.parent.onscroll = null;

    this.parent.addEventListener('scroll',this.getScrollPosition);
    this.parent.onscroll = this.getScrollPosition;


    if (this.data.length) {

      this.bindData(this.data);

    } else {
      if (
        !this.options ||
        !this.options.dataOptions ||
        !this.options.dataOptions.read ||
        !this.options.dataOptions.read.url
      ) {
        throw new Error("Please set data or url");
      }

      DataService.getData(this.options.dataOptions.read.url, null).then(
        (data: any[]) => {
          this.data = data;
          const t0 = performance.now();

          this.bindData(data);

          var t1 = performance.now();
          console.log("Call to binding data took " + (t1 - t0) + " milliseconds.");
        }
      );
    }
  }

  getScrollPosition = (event:UIEvent) => {
    
    const loadsize = this.options.clientInfinityScrollDataSize;
    const element = <HTMLElement>(event.target);
    if(element.scrollTop%element.offsetHeight>0.6*element.offsetHeight){
      // console.log('load data');
      const data = this.loadData(loadsize);
      this.rootTable.appendChild(this.generateRows(data));
    }
  }


  private bindData(data: any[]) {

    this.root = document.createDocumentFragment();

    const root = this.root;

    if(this.options.clientInfinityScrollDataSize){
      data = this.loadData(this.options.clientInfinityScrollDataSize);
    }

    const table = this.generateTable();

    const header = this.generateHeader(this.options.Columns);
    table.appendChild(header);

    const rows = this.generateRows(data);
    table.appendChild(rows);

    // docfrag element
    root.appendChild(table);

    // parent node
    this.element.appendChild(root);
  }

  loadIndex = 0;

  loadData(size:number){

    const data = this.data.filter((v,i) =>{
      return i >= this.loadIndex*size  && i < (this.loadIndex+1)*size;
    });
    this.loadIndex++;

    return data;
  }

  generateTable(){

    const rootChild = document.createElement("table");
    rootChild.classList.add("ws-root", "ws-container");
    this.rootTable = rootChild;
    return rootChild;

  }

  generateRows(data:any[]){

    const rows = document.createDocumentFragment();

    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      const row = this.generateRow(item,i);
      // parent.appendChild(row);
      rows.appendChild(row);
    }

    return rows;
  }

  appendNewRows(data:any[]){

    const dfrag = document.createDocumentFragment();

    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      const row = this.generateRow(item,i);
      dfrag.appendChild(row);
    }

    return dfrag;
  }

  generateRow(item:any,index:number){

    const row = document.createElement("tr");
    row.classList.add("ws-row", "ws-row-" + index);

    for (let name in item) {
      const column = this.options.getColumn(name);
      const elem = this.generateElement(item[name], column);
      row.appendChild(elem);
    }

    return row;
  }

  generateHeader(columns: IColumn[]) {

      const header = document.createElement("tr");
      header.classList.add('ws-row','ws-header-row');

      columns.forEach((val,i)=>{
        const col = document.createElement("th");

        col.classList.add('ws-header-elem');
        
        if(val.headerStyles){
          Object.keys(val.headerStyles).forEach((s,j)=>{
            (<any>col.style)[s] = (<any>val.headerStyles)[s];
          });

        }

        // col.style.flex = '1';
        const txt = document.createElement("span");

        txt.textContent = val.name || val.field;
        col.appendChild(txt);

        if(this.options.filterable) {
          const filter = document.createElement("span");
          filter.setAttribute("data-filter-for",val.field);
          filter.classList.add('ws-filterable');
          col.appendChild(filter);          
        }

        header.appendChild(col);
      });

      if(this.options.filterable){
      header.addEventListener('click',(event:Event)=>{
        if((<HTMLElement>event.target).className.indexOf('ws-filterable') !== -1){
          const fieldName = (<HTMLElement>event.target).getAttribute("data-filter-for");
          const column = this.options.Columns.filter(c => c.field === fieldName)[0];

          document.body.appendChild(ColumnOptionsView.Generate(column).columnView.element);
        }
      });
    }

    return header;

      // parent.appendChild(header);
  }

  private generateElement(data: any, column: IColumn) {

    const td = document.createElement("td");
    td.setAttribute("data-type", column.dataType);
    td.classList.add("ws-elem","ws-elem-text",'ws-elem-' + column.field);

    const tagName = !column.readonly && !column.locked ? "input":"span";

    const e = document.createElement(tagName);


    if(tagName === "span"){
      e.textContent = data;
    }else{
      e.setAttribute("type","text");
      (<HTMLInputElement>e).value =  data;
    }




    // e.disabled = column.readonly || column.locked;

    td.appendChild(e);

    return td;
  }

  static Websheet(selector: string, options?: SheetOptions): WebSheet {
    return new WebSheet(selector, options);
  }
}

if (window) window.Websheet = WebSheet;
