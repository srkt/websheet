import { IColumn } from "./column";
import { Element } from "./Element";

export class ColumnOptionsView {
  columnView: Element;

  constructor(public column: IColumn) {
    this.columnView = Element.New("div", null, "ws-col-view");

      this.columnView.addChild(
        Element.New("div", null, "ws-search").addChild(
          Element.New("input", "text", "ws-search-text")
        )
      );

  }

  static Generate(column:IColumn){
      return new ColumnOptionsView(column);
  }

  sortAscending() {}

  sortDescending() {}

}
