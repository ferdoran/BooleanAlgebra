/**
 * Created by Sergej on 16.12.2016.
 */
var KVDiagram = function(){
    this.field = [];

    var width = 0, height = 0;

    this.getWidth = function(){
        return width;
    };
    this.getHeight = function() {
        return height;
    };

    this.getRow = function(index){
        return this.field[index];
    };

    var reflectV = function (A) {
        var reflField = [];
        for (var r = A.length - 1; r >= 0; r--) {
            var row = A[r];
            reflField.push(row.clone());
        }
        return A.concat(reflField);
    };

    var reflectH = function(A) {
        for (var r = 0; r < A.length; r++) {
            var mirror = [];
            var row = A[r];
            for (var c = row.getLength() - 1; c >= 0; c--) {
                var col = row.getCol(c);
                mirror.push(col.clone());
            }
            row.appendCols(mirror);
        }
        return A;
    };

    this.reflectHorizontal = function (Var) {
        if (this.field.length < 1) {
            var newRow = new KVRow();
            newRow.addCol(new KVCol(0));
            newRow.addCol(new KVCol(0));
            this.field.push(newRow);
        } else {
            this.field = reflectH(this.field);
        }

        width = this.field[0].getLength();
        var half = width / 2;
        for (var i = 0; i < this.field.length; i++) {
            var row = this.field[i];
            for (var j = 0; j < half; j++) {
                var colA = row.getCol(j);
                var colB = row.getCol(half + j);
                colA.addVar(Var);
                colB.addVar(SYMBOL_NEG + Var);
            }
        }
    };
    this.reflectVertical = function(Var) {
        if (this.field.length < 2) {
            var row = this.field[0].clone();
            this.field.push(row);
        } else {
            this.field = reflectV(this.field);
        }

        height = this.field.length;
        var half = height / 2;
        for (var i = 0; i < half; i++) {
            var rowA = this.field[i];
            var rowB = this.field[half + i];
            for (var j = 0; j < rowA.getLength(); j++) {
                rowA.getCol(j).addVar(Var);
                rowB.getCol(j).addVar(SYMBOL_NEG + Var);
            }
        }
    };
};

var KVCol = function(value,Var){
    this.value = value || 0;
    this.assignedVars = Var ? (Array.isArray(Var) ? Var : [Var]) : [];
    this.addVar = function(char){
        this.assignedVars.push(char);
    };
    this.clone = function(){
        var vars = [];
        for (var i = 0; i < this.assignedVars.length; i++) {
            vars.push(this.assignedVars[i]);
        }
        return new KVCol(this.value, vars);
    };
};
var KVRow = function(){
    this.cols = [];

    this.addCol = function(col){
        this.cols.push(col);
    };

    this.appendCols = function(A) {
        this.cols = this.cols.concat(A);
    };

    this.getCol = function(index) {
        return this.cols[index];
    };

    this.getLength = function(){
        return this.cols.length;
    };

    this.clone = function(){
        var row = new KVRow();
        for (var i = 0; i < this.cols.length; i++) {
            row.addCol(this.cols[i].clone());
        }
        return row;
    };
};
var KVBlock = function(x, y, width, height, cell){
    this.x = x || 0;
    this.y = y || 0;
    this.width = width || 0;
    this.height = height || 0;

    this.cell = cell;
    var hasBorder = cell != undefined;

    this.draw = function(ctx){
        ctx.font = "32px Helvetica";
        ctx.fillText(this.cell.value, this.x + this.width / 2 - 8, this.y + this.height - 4);
        if (hasBorder) {
            ctx.rect(this.x, this.y, this.width, this.height);
            ctx.stroke(); ctx.stroke();
        }
// ----> http://fabricjs.com/intersection
    };
};
var BAKV = function (expr) {
    var $this = this;

    this.diagram = null;
    this.expr = expr;
    var scale = 1;
    var size = 32;

    var canvas = null;
    var ctx = null;

    var vars = [];

    this.setScale = function(_scale){
        scale = _scale;
    };
    this.getScale = function() {
        return scale;
    };
    this.setBlockSize = function(_size){
        size = _size;
    };
    this.getBlockSize = function() {
        return size;
    };

    this.setCanvas = function(target){
        canvas = document.getElementById(target);
        if (canvas.tagName != "CANVAS") {
            var c = document.createElement("CANVAS");
            canvas.appendChild(c);
            canvas = c;
        }

        ctx = canvas.getContext("2d");

    };

    this.resizeCanvas = function(){
        var varSizeV = parseInt(vars.length / 2);
        var varSizeH = vars.length - varSizeV;

        var canvasWidth = varSizeV * size + this.diagram.getWidth() * size;
        var canvasHeight = varSizeH * size + this.diagram.getHeight() * size;

        canvas.width = canvasWidth + size * 2;
        canvas.height = canvasHeight + size * 2;
    };

    var blocks = [];

    this.generateBlocks = function(){
        var gridOffset = {x: 96, y: 96};
        blocks = [];
        for (var r = 0; r < this.diagram.getHeight(); r++) {
            var row = this.diagram.getRow(r);
            for (var c = 0; c < this.diagram.getWidth(); c++) {
                var col = row.getCol(c);
                var block = new KVBlock(gridOffset.x + c * size, gridOffset.y + r * size, size, size, col);
                blocks.push(block);
            }
        }
    };
    this.refresh = function(){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (var i = 0; i < blocks.length; i++) {
            var block = blocks[i];
            console.log(block);
            block.draw(ctx);
        }
    };

    this.generateKV = function(V) {
        vars = V;
        var A = new KVDiagram();

        for (var i = 0; i < V.length; i++) {
            if (i % 2 == 0) {
                A.reflectHorizontal(V[i]);
            } else {
                A.reflectVertical(V[i]);
            }
        }
        this.diagram = A;
    };

    this.write = function(text, x, y) {
        ctx.fillText(text, x, y);
    };
};