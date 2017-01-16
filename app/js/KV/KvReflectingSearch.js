/**
 * Created by Sergej on 14.01.2017.
 */

var KvReflectingBlock = function(cell){
    var width = 1;
    this.getWidth = function(){
        return width;
    };
    this.setWidth = function(w){
        width = w;
    };
    this.getHeight = function(){
        return this.cells.length;
    };
    this.cells = [[cell]];

    this.equals = function(block) {
        return false;
    };

    this.clone = function () {
        var block = new KvReflectingBlock(cell);
        block.setWidth(this.getWidth());
        block.cells = this.cells;
        return block;
    };

    var minVars = {};
    var calcMin = function(key, value) {
        var minEntry = minVars[key];
        if (minEntry == -1) return;
        if (minEntry == 0 || minEntry == 1) {
            if (minEntry != value) {
                minVars[key] = -1;
            }
        } else {
            minVars[key] = value;
        }
    };
    this.getExpr = function(asString){
        if (minVars.length > 0) return minVars;
        var key, value;
        for (var r = 0; r < this.getHeight(); r++) {
            var row = this.cells[r];
            for (var c = 0; c < this.getWidth(); c++) {
                var cell = row[c];
                var vars = cell.assignedVars;
                for (key in vars) {
                    calcMin(key, vars[key]);
                }
            }
        }
        var newMinVarsKeys = [];

        for (key in minVars) {
            value = minVars[key];
            if (value < 0) continue;
            newMinVarsKeys.push(key);
        }
        newMinVarsKeys.sort();

        var expr = "";
        var eConnect = cell.value == 1 ? KVDiagram.Conjunction : KVDiagram.Disjunction;
        for (var i = 0; i < newMinVarsKeys.length; i++) {
            key = newMinVarsKeys[i];
            value = minVars[key];
            value = value == 0 && cell.value == 1 ? SYMBOL_NEG + key : key;
            expr = eConnect(expr, value);
        }

        if (asString) return expr;
        return new BAExpression(expr);
    };

    this.concatHorizontal = function(A, B) {
        var C = [];
        // FEHLER WENN A != B
        var maxHeight = Math.min(A.length, B.length);
        for (var r = 0; r < maxHeight; r++) {
            C.push(A[r].concat(B[r]));
        }
        this.cells = C;
        width = this.cells[0].length;
        minVars = {};
    };

    this.concatVertical = function(A, B) {
        this.cells = A.concat(B);
        minVars = {};
    };

    this.areReflectable = function(cellA, cellB) {
        return cellA.n != cellB.n && cellA.value == cellB.value;
    };

    this.reflect = function(){
        if (this.reflectRight(false)) {
            return true;
        } else if (this.reflectDown(false)) {
            return true;
        } else if (this.reflectLeft(false)) {
            return true;
        } else if (this.reflectUp(false)) {
            return true;
        } else if (this.reflectRight(true)) {
            return true;
        } else if (this.reflectDown(true)) {
            return true;
        } else if (this.reflectLeft(true)) {
            return true;
        } else if (this.reflectUp(true)) {
            return true;
        }

        return false;
    };
    this.reflectRight = function (throughWall) {
        var collection = [];
        for (var r = 0; r < this.getHeight(); r++) {
            var row = this.cells[r];
            var first = row[0];
            var last = row[row.length - 1];
            var next = last;
            var collectionRow = [];
            for (var c = 0; c < this.getWidth(); c++) {
                next = next.right;
                if (next.n < last.n && !throughWall) return false;
                if (next.equals(first)) return false;
                if (!this.areReflectable(last, next)) return false;
                collectionRow.push(next);
            }
            collection.push(collectionRow);
        }
        this.concatHorizontal(this.cells, collection);
        return true;
    };

    this.reflectLeft = function(throughWall){
        var collection = [];
        for (var r = 0; r < this.getHeight(); r++) {
            var row = this.cells[r];
            var first = row[0];
            var last = row[row.length - 1];
            var next = first;
            var collectionRow = [];
            for (var c = 0; c < this.getWidth(); c++) {
                next = next.left;
                if (next.n > first.n && !throughWall) return false;
                if (next.equals(last)) return false;
                if (!this.areReflectable(first, next)) return false;
                collectionRow.unshift(next);
            }
            collection.push(collectionRow);
        }
        this.concatHorizontal(collection, this.cells);
        return true;
    };

    this.reflectDown = function(throughWall){
        var lastRow = this.cells[this.cells.length - 1];
        var firstRow = this.cells[0];

        var collection = [];
        for (var c = 0; c < this.getWidth(); c++) {
            var first = firstRow[c];
            var last = lastRow[c];
            var next = last;
            for (var r = 0; r < this.getHeight(); r++) {
                next = next.bottom;
                if (next.n < last.n && !throughWall) return false;
                if (next.equals(first)) return false;
                if (!this.areReflectable(last, next)) return false;
                var collectionRow;
                if (collection.length <= r) {
                    collection.push(collectionRow = []);
                } else {
                    collectionRow = collection[r];
                }
                collectionRow.push(next);
            }
        }

        this.concatVertical(this.cells, collection);
        return true;
    };

    this.reflectUp = function(throughWall){
        var lastRow = this.cells[this.cells.length - 1];
        var firstRow = this.cells[0];
        var collection = [];
        for (var c = 0; c < this.getWidth(); c++) {
            var first = firstRow[c];
            var last = lastRow[c];
            var next = first;
            for (var r = 0; r < this.getHeight(); r++) {
                next = next.top;
                if (next.n > first.n && !throughWall) return false;
                if (next.equals(last)) return false;
                if (!this.areReflectable(first, next)) return false;
                var collectionRow;
                if (collection.length <= r) {
                    collection.push(collectionRow = []);
                } else {
                    collectionRow = collection[r];
                }
                collectionRow.push(next);
            }
        }
        var newCollection = [];
        for (var i = collection.length - 1; i >= 0; i--) {
            newCollection.push(collection[i]);
        }
        this.concatVertical(newCollection, this.cells);
        return true;
    };
};
KvReflectingBlock.debug = function(block) {
    if (block instanceof KvReflectingBlock) {
        var obj = {
            width: block.getWidth(),
            height: block.getHeight(),
            cells: block.cells,
            done: block.isDone()
        };
        console.log(obj);
    }
};

var KvReflectingSearch = function(){
    this.search = function(cells, value){
        var blocks = [];
        for (var i = 0; i < cells.length; i++){
            var cell = cells[i];
            if (cell.visited || cell.value != value) continue;
            var block = new KvReflectingBlock(cell);
            this.expand(block);
            blocks.push(block);
        }
        return blocks;
    };

    this.expand = function(block) {
        while (this.reflect(block)) {}
        for (var r = 0; r < block.getHeight(); r++) {
            var row = block.cells[r];
            for (var c = 0; c < block.getWidth(); c++) {
                var cell = row[c];
                cell.visited = true;
            }
        }
    };

    this.reflect = function(block){
        return block.reflect();
    };
};

