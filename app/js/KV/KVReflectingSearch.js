/**
 * Created by Sergej on 14.01.2017.
 */
var KVReflectingSearch = Class.extend(function(){
    this.cellField = null;

    this.constructor = function(cellField) {
        if (cellField) this.cellField = cellField;
        console.log(cellField);
    };

    this.init = function(cells){
        /* Reset visited flag */
        for (var i = 0; i < cells.length; i++) {
            var cell = cells[i];
            if (cell) {
                cell.visited = false;
            }
        }
    };

    this.search = function(cells, value){
        var blocks = [];

        this.init(cells);

        /* Travel all cells, which are not visited and have same value */
        for (var i = 0; i < cells.length; i++){
            var cell = cells[i];
            if (cell.visited || cell.value != value) continue;
            var block = new KVReflectingBlock(cell, this.cellField);
            this.expand(block);
            blocks.push(block);
        }
        return blocks;
    };

    this.expand = function(block) {
        /* Expand every cell until it is expandable */
        while (this.reflect(block)) {}
        for (var r = 0; r < block.getHeight(); r++) {
            var row = block.cells[r];
            for (var c = 0; c < block.getWidth(); c++) {
                var cell = row[c];
                /* Visit every cell inside this block */
                cell.visited = true;
            }
        }
    };

    this.reflect = function(block){
        return block.reflect();
    };
});

var KVReflectingSearchCustom = KVReflectingSearch.extend(function(){

    this.cells = [];

    this.init = function(cellField, width, height){
        this.cells = [];
        for (var r = 0; r < height; r++) {
            var row = cellField[r];
            if (!row) continue;
            for (var c = 0; c < width; c++) {
                var cell = row.getCell(c);
                if (!cell) continue;
                cell.visited = false;
                this.cells.push(cell);
            }
        }
    };

    this.search = function(cellField, width){
        var height = cellField.length;
        if (height < 1) return [];
        var blocks = [];

        this.init(cellField, width, height);
        for (var r = 0; r < height; r++) {
            var row = cellField[r];
            if (!row) continue;
            for (var c = 0; c < width; c++) {
                var cell = row.getCell(c);
                if (!cell) continue;
                if (cell.visited) continue;
                var block = new KVReflectingBlock(cell, this.cells);
                this.expand(block);
                blocks.push(block);
            }
        }
        return blocks;
    };
});