/**
 * Created by Sergej on 11.01.2017.
 */
var ColorPathLayer = function(color){
    this.color = color;
    this.cellField = [];
    this.cells = [];

    this.blocks = [];

    var searchAlgo = new KvReflectingSearchCustom();

    this.toggleCell = function(cell, width) {
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

        for (var i = 0; i < this.cells.length; i++) {
            this.cells[i].cVisited = false;
        }
        this.blocks = searchAlgo.search(this.cellField, width);
        for (i = 0; i < this.blocks.length; i++) {
            this.blocks[i].color = this.color;
        }
        return this.cells.length;
    };
};
var ColorPathMap = function(){
    this.diagram = null;
    this.canvas = null;

    this.layers = [];

    this.config = function(canvas, diagram) {
        this.diagram = diagram;
        this.canvas = canvas;
    };

    this.analyze = function(cell, color) {
        var colorLayer;
        if (color in this.layers) {
            colorLayer = this.layers[color];
        } else {
            this.layers[color] = colorLayer = new ColorPathLayer(color);
        }
        colorLayer.toggleCell(cell, this.diagram.getWidth());

        var blocks = [];
        var keys = Object.keys(this.layers);
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            blocks = blocks.concat(blocks, this.layers[key].blocks);

        }
        return blocks;
    };
};