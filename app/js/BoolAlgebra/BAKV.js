/**
 * Created by Sergej on 16.12.2016.
 */
var KVDiagram = function(){
    this.field = [];
    this.reflectHorizontal = function (Var) {
        console.log("REFLECT HORIZONTAL ON "+ Var);
    };
    this.reflectVertical = function(Var) {
        console.log("REFLECT VERTICAL ON " + Var);
    };
};

var KVCol = function(value,Var){
    this.value = value;
    this.assignedVars = Array.isArray(Var) ? Var : [Var];
    this.addVar = function(char){
        this.assignedVars.push(char);
    };
};
var KVRow = function(){
    this.cols = [];

    this.addCol = function(col){
        this.cols.push(col);
    };
};

var BAKV = function (expr) {
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

    this.generateKV(['A']);
    this.generateKV(['A', 'B']);
    this.generateKV(['A', 'B', 'C']);
    this.generateKV(['A', 'B', 'C', 'D']);
    this.generateKV(['A', 'B', 'C', 'D', 'E']);
    this.generateKV(['A', 'B', 'C', 'D', 'E', 'F']);

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