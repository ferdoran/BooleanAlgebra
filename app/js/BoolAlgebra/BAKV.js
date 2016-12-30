/**
 * Created by Sergej on 16.12.2016.
 */
var KVDiagram = function(){
    this.field = [];

    var width = 0;

    this.getWidth = function(){
        return width;
    };
    this.getHeight = function() {
        return this.field.length;
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

        var half = this.getHeight() / 2;
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
var KVBlock = function(x, y, width, height, value){
    this.x = x || 0;
    this.y = y || 0;
    this.width = width || 0;
    this.height = height || 0;
    this.value = value || 0;

    this.fill = 'white';

    this.getText = function(){
        return this.value || '0';
    };
    this.isInside = function(p) {
        return p.x >= this.x && p.x < this.x + this.width &&
                p.y >= this.y && p.y < this.y + this.height;
    };
    this.draw = function(ctx){
        ctx.fillStyle = this.cell ? this.fill : 'transparent';
        ctx.fRect(x,y,width,height);
        ctx.beginPath();
        ctx.strokeStyle = this.cell ? 'black' : 'transparent';
        ctx.sRect(x, y, width, height);
        ctx.fillStyle = 'black';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = this.cell ? '30px Verdana' : '18px Verdana';
        ctx.fillText(value + "", x + width / 2, y + height / 2);
    };
    this.getRenderObject = function(caption){
        return this;
    };
};
var BAKV = function (params) {
    this.diagram = null;

    this.expr = params.expr || null;
    var size = 32;

    var canvas = null;

    var vars = [];
    var selectColor = null;

    this.setCanvas = function(target){
        canvas = CanvasInterface.createEasel(target);

        canvas.onBlockClick = function(parm){
            if (selectColor != null) {
                canvas.placeOverlay(parm.block, selectColor);
            } else {
                parm.block.value = parm.block.value == 0 ? 1 : 0;
                parm.label.text = parm.block.value;
            }
            canvas.refresh();
        };

        canvas.onBlockHover = function(parm) {
            canvas.setHoverOverlayPosition(parm.block.x, parm.block.y);
            canvas.refresh();
        };

        canvas.onBlockOut = function(parm) {
            canvas.refresh();
        };
    };
    this.setCanvas(params.target);

    this.setSelectColor = function(color) {
        selectColor = color;
        canvas.setHoverOverlayStyle(color);
    };

    this.resizeCanvas = function(){
        var h = Math.ceil(vars.length / 2);
        var w = vars.length - h;

        var canvasWidth = w * size + this.diagram.getWidth() * size + size;
        var canvasHeight = h * size + this.diagram.getHeight() * size + size;

        canvas.setSize(canvasWidth, canvasHeight);
    };

    this.generateBlocks = function(){
        var h = Math.ceil(vars.length / 2);
        var w = vars.length - h;

        var gridOffset = {x: size * w, y: size * h};

        canvas.clearChildren();
        for (var r = 0; r < this.diagram.getHeight(); r++) {
            var row = this.diagram.getRow(r);

            var firstcol = row.cols[0];

            var block, aVar;

            for (var rI = 1, offX = 1; rI < firstcol.assignedVars.length; rI+=2, offX++) {
                aVar = firstcol.assignedVars[rI];
                block = new KVBlock(gridOffset.x + offX * -size, gridOffset.y + r * size, size, size, aVar);

                canvas.add(block.getRenderObject(true));
            }

            for (var c = 0; c < this.diagram.getWidth(); c++) {
                var col = row.getCol(c);

                if (r == 0) {
                    for (var cI = 0, offY = 1; cI < col.assignedVars.length; cI+=2, offY++) {
                        aVar = col.assignedVars[cI];
                        block = new KVBlock(gridOffset.x + c * size, gridOffset.y + offY * -size, size, size, aVar);
                        canvas.add(block.getRenderObject(true));
                    }
                }

                block = new KVBlock(gridOffset.x + c * size, gridOffset.y + r * size, size, size, col.value);
                block.cell = col;
                canvas.add(block.getRenderObject());
            }
        }
        canvas.createHoverOverlay();

        canvas.refresh(true);
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

        this.resizeCanvas();
        this.generateBlocks();
    };

    this.refresh = function(){
        canvas.refresh();
    };
};