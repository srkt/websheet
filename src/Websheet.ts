import { SheetOptions } from "./SheetOptions";
import DataService from "./WsData";
import { IColumn } from "./column";

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

  get columnCount() {
    return this.options.Columns.length;
  }

  constructor(selector: string, public options?: SheetOptions) {
    if (!selector) throw new Error("invalid selector passed");

    this.element = document.querySelector(selector);

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
          this.bindData(data);
        }
      );
    }
  }

  private bindData(data: any[]) {

    this.root = document.createDocumentFragment();

    const root = this.root;

    const rootChild = document.createElement("div");
    rootChild.classList.add("ws-root", "ws-container");

    const header = this.generateHeader(this.options.Columns);
    rootChild.appendChild(header);

    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      const row = document.createElement("div");
      row.classList.add("ws-row", "ws-row-" + i);

      for (let name in item) {
        const column = this.options.getColumn(name);
        const elem = this.generateElement(item[name], column);
        row.appendChild(elem);
      }

      rootChild.appendChild(row);
    }

    root.appendChild(rootChild);

    this.element.appendChild(root);
  }

  generateHeader(columns: IColumn[]) {

      const header = document.createElement("div");
      header.classList.add('ws-row','ws-header-row');

      columns.forEach((val,i)=>{
        const col = document.createElement("div");

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
        header.appendChild(col);
      });

      return header;
  }

  private generateElement(data: any, column: IColumn) {
    const elem = document.createElement("div");
    elem.classList.add("ws-elem",'ws-elem-' + column.field);
    //elem.style.flex = "1";
    const e = document.createElement("span");
    e.setAttribute("data-type", column.dataType);
    e.className = "ws-elem-text";
    e.textContent = data;
    elem.appendChild(e);
    return elem;
  }

  static Websheet(selector: string, options?: SheetOptions): WebSheet {
    return new WebSheet(selector, options);
  }
}

if (window) window.Websheet = WebSheet;
