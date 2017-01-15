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

    var isDoneFlag = false;
    this.isDone = function(){
        return isDoneFlag;
    };

    this.equals = function(block) {
        return false;
    };

    this.clone = function () {
        var block = new KvReflectingBlock(cell);
        block.setWidth(this.getWidth());
        block.cells = this.cells;
        return block;
    };

    this.concatHorizontal = function(A, B) {
        var C = [];
        var maxHeight = Math.min(A.length, B.length);
        for (var r = 0; r < maxHeight; r++) {
            C.push(A[r].concat(B[r]));
        }
        this.cells = C;
        width = this.cells[0].length;
    };

    this.concatVertical = function(A, B) {
        this.cells = A.concat(B);
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
    this.reflectRight = function (throwWall) {
        var collection = [];
        for (var r = 0; r < this.getHeight(); r++) {
            var row = this.cells[r];
            var first = row[0];
            var last = row[row.length - 1];
            var next = last;
            var collectionRow = [];
            for (var c = 0; c < this.getWidth(); c++) {
                next = next.right;
                if (next.n < last.n && !throwWall) return false;
                if (next.equals(first)) return false;
                if (!this.areReflectable(last, next)) return false;
                collectionRow.push(next);
            }
            collection.push(collectionRow);
        }
        this.concatHorizontal(this.cells, collection);
        return true;
    };

    this.reflectLeft = function(throwWall){
        var collection = [];
        for (var r = 0; r < this.getHeight(); r++) {
            var row = this.cells[r];
            var first = row[0];
            var last = row[row.length - 1];
            var next = first;
            var collectionRow = [];
            for (var c = 0; c < this.getWidth(); c++) {
                next = next.left;
                if (next.n > first.n && !throwWall) return false;
                if (next.equals(last)) return false;
                if (!this.areReflectable(first, next)) return false;
                collectionRow.unshift(next);
            }
            collection.push(collectionRow);
        }
        this.concatHorizontal(collection, this.cells);
        return true;
    };

    this.reflectDown_ = function(throwWall){
        var lastRow = this.cells[this.cells.length - 1];
        var firstRow = this.cells[0];

        var collection = [];
        for (var c = 0; c < this.getWidth(); c++) {
            var first = firstRow[c];
            var last = lastRow[c];
            var next = last;
            for (var r = 0; r < this.getHeight(); r++) {
                next = next.bottom;
                if (next.n < last.n && !throwWall) return false;
                if (next.equals(first)) return false;
                if (!this.areReflectable(last, next)) return false;
                if (r >= collection.length) {
                    collection.push([]);
                }
                var collectionRow = collection[r];
                collectionRow.push(next);
            }
        }
        this.concatVertical(this.cells, collection);
        return true;
    };

    this.reflectDown = function(throwWall){
        var lastRow = this.cells[this.cells.length - 1];
        var firstRow = this.cells[0];

        var collection = [];
        for (var c = 0; c < this.getWidth(); c++) {
            var first = firstRow[c];
            var last = lastRow[c];
            var next = last;
            for (var r = 0; r < this.getHeight(); r++) {
                next = next.bottom;
                if (next.n < last.n && !throwWall) return false;
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

    this.reflectUp_ = function(throwWall){
        var lastRow = this.cells[this.cells.length - 1];
        var firstRow = this.cells[0];
        var collection = [];
        for (var c = 0; c < this.getWidth(); c++) {
            var first = firstRow[c];
            var last = lastRow[c];
            var next = first;
            for (var r = 0; r < this.getHeight(); r++) {
                next = next.top;
                if (next.n > first.n && !throwWall) return false;
                if (next.equals(last)) return false;
                if (!this.areReflectable(first, next)) return false;
                if (r >= collection.length) {
                    collection.unshift([]);
                }
                var collectionRow = collection[0];
                collectionRow.push(next);
            }
        }
        this.concatVertical(collection, this.cells);
        return true;
    };

    this.reflectUp = function(throwWall){
        var lastRow = this.cells[this.cells.length - 1];
        var firstRow = this.cells[0];
        var collection = [];
        for (var c = 0; c < this.getWidth(); c++) {
            var first = firstRow[c];
            var last = lastRow[c];
            var next = first;
            for (var r = 0; r < this.getHeight(); r++) {
                next = next.top;
                if (next.n > first.n && !throwWall) return false;
                if (next.equals(last)) return false;
                if (!this.areReflectable(first, next)) return false;
                var collectionRow;
                if (collection.length <= r) {
                    collection.unshift(collectionRow = []);
                } else {
                    collectionRow = collection[0];
                }
                collectionRow.push(next);
            }
        }
        this.concatVertical(collection, this.cells);
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

