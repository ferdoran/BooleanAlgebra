/**
 * Created by Sergej on 18.01.2017.
 */
var ColorPathLayer = function(color){
    this.color = color;
    this.cellField = [];
    this.cells = [];

    this.resultState = 0;

    this.expression = new BAExpression();
    this.blocks = [];
    this.value = -1;

    var searchAlgo = new KVReflectingSearchCustom();

    this.getBlocksExpr = function(asString){
        var expr = "";
        var eConnect = this.value == 0 ? KVDiagram.Conjunction : KVDiagram.Disjunction;
        for (var i = 0; i < this.blocks.length; i++) {
            var block = this.blocks[i];
            var e = block.getExpr(true);
            if (this.blocks.length > 1) e = "(" + e + ")";
            expr = eConnect(expr, e);
        }
        if (asString) return expr;
        return new BAExpression(expr);
    };

    this.checkExpression = function () {
        var userExpr = this.getBlocksExpr();
        this.resultState = this.expression.equals(userExpr) ? 1 : -1;
        return this.resultState;
    };

    this.toggleCell = function(cell, width) {
        if (this.value != -1 && this.value != cell.value) return;
        var pos = {col: parseInt(cell.n % width), row: parseInt(cell.n / width)};
        var row = this.cellField[pos.row];
        cell.cVisited = false;
        if (!row) {
            row = this.cellField[pos.row] = [];
        }
        if (row[pos.col]) {
            row[pos.col] = null;
        } else {
            row[pos.col] = cell;
        }
        this.cells.toggleObject(cell);
        if (this.cells.length == 0) {
            this.value = -1;
        }
        else if (this.cells.length == 1) {
            this.value = this.cells[0].value;
        }
        this.blocks = searchAlgo.search(this.cellField, width);
        for (var i = 0; i < this.blocks.length; i++) {
            this.blocks[i].color = this.color;
        }
        return this.cells.length;
    };
};