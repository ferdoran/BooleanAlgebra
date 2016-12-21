/**
 * Created by Sergej on 16.12.2016.
 */
var KVDiagram = function(){
    this.field = [];
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

        var half = this.field[0].getLength() / 2;
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

        var half = this.field.length / 2;
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

var BAKV = function (expr) {
    this.diagram = null;

    this.setCanvas = function(target){
        canvas = document.getElementById(target);
        if (canvas.tagName != "CANVAS") {
            var c = document.createElement("CANVAS");
            canvas.appendChild(c);
            canvas = c;
        }

        ctx = canvas.getContext("2d");
        ctx.font = "16px Helvetica";
    };



    this.generateKV = function(V) {

        console.log("V = " + V);
        var A = new KVDiagram(), char = '', negChar = '', firstRowCols= null, i, j;

        for (i = 0; i < V.length; i++) {
            if (i % 2 == 0) {
                A.reflectHorizontal(V[i]);
            } else {
                A.reflectVertical(V[i]);
            }
        }

        console.log(A);

        this.diagram = A;
        return false;

        /*var A_Length = Math.pow(2, V.length);
        console.log(A_Length + " Felder");
        var A = [], i,
            width = 0,
            height = 0;

        for (i = 0; i < V.length; i++) {
            if (i % 2 == 0) {
                width++;
            } else {
                height++;
            }
        }

        console.log("Vars in Breite " + width);
        console.log("Vars in Höhe " + height);

        var fWidth = Math.pow(2, width);
        var fHeight = Math.pow(2, height);

        console.log("Feldbreite " + fWidth);
        console.log("Feldhöhe " + fHeight);

        var lastChar = '', negChar = '';
        for (i = 0; i < V.length; i++) {
            var char = V[i];
            if (lastChar != char) {
                lastChar = char;
                negChar = SYMBOL_NEG + lastChar;
                var zx = parseInt(i / 2) + 1;
                console.log(zx + ":" + lastChar + " " + negChar);
                var str = '';
                for (var j = 0; j < zx; j++) {
                    str += lastChar;
                }
                console.log(str);
            }
        }*/
    };

    return;
    var canvas = null;
    var ctx = null;
    this.expr = expr;
    var $this = this;
    this.scale = 1;



    this.write = function(text, x, y) {
        ctx.fillText(text, x, y);
    };
};