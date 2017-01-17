/**
 * Created by Sergej on 11.01.2017.
 */
var ColorPathLayer = function(color){
    this.color = color;
    this.cellField = [];
    this.cells = [];

    this.blocks = [];
    this.value = -1;

    var searchAlgo = new KvReflectingSearchCustom();

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
var ColorPathMap = function(){
    this.diagram = null;
    this.canvas = null;

    this.layers = [];

    this.onAddedLayer = function(layer){};
    this.onRemoveLayer = function(layer){};

    this.config = function(canvas, diagram) {
        this.diagram = diagram;
        this.canvas = canvas;
    };

    this.getLayer = function(color) {
        for (var i = 0; i < this.layers.length; i++) {
            var layer = this.layers[i];
            if (layer.color == color) return layer;
        }
        return null;
    };

    this.analyze = function(cell, color) {
        var colorLayer = this.getLayer(color);
        if (colorLayer == null) {
            colorLayer = new ColorPathLayer(color);
            this.layers.push(colorLayer);
            this.onAddedLayer(colorLayer);
        }
        var length = colorLayer.toggleCell(cell, this.diagram.getWidth());

        if (length == 0) {
            this.onRemoveLayer(colorLayer);
        }

        var blocks = [];

        for (var i = 0; i < this.layers.length; i++) {
            blocks = blocks.concat(blocks, this.layers[i].blocks);

        }
        return blocks;
    };
};