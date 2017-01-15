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

    var _onedimensionCache = [];
    this.getOnedimension = function () {
        if (_onedimensionCache.length > 0) return _onedimensionCache;
        for (var r = 0; r < this.getHeight(); r++) {
            var row = this.cells[r];
            for (var c = 0; c < this.getWidth(); c++) {
                var _cell = row[c];
                _onedimensionCache.push(_cell);
            }
        }
        _onedimensionCache.sort(KVCol.compare);
        return _onedimensionCache;
    };

    this.equals = function(block) {
        if (this.getWidth() != block.getWidth() || this.getHeight() != block.getHeight()) {
            return false;
        }
        var a = this.getOnedimension();
        var b = block.getOnedimension();
        if (a.length != b.length) return false;
        for (var i = 0; i < a.length; i++) {
            if (a[i].n != b[i].n) {
                return false;
            }
        }
        return true;
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

    this.getRightest = function(row) {
        return this.cells[row][this.getWidth() - 1];
    };

    this.getLeftest = function(row) {
        return this.cells[row][0];
    };

    this.areReflectable = function(cellA, cellB) {
        return cellA.n != cellB.n && cellA.value == cellB.value;
    };

    this.reflect = function(){
        var right = this.reflectRight();
        var down = this.reflectDown();
        var left = this.reflectLeft();
        var up = this.reflectUp();

        var newBlocks = [];
        if (right != null) newBlocks.push(right);
        if (down != null) newBlocks.push(down);
        if (left != null) newBlocks.push(left);
        if (up != null) newBlocks.push(up);

        if (newBlocks.length == 0) {
            isDoneFlag = true;
        }

        return newBlocks;
    };
    this.reflectRight = function () {
        var block = this.clone();

        var collection = [];
        for (var r = 0; r < this.getHeight(); r++) {
            var row = this.cells[r];
            var first = row[0];
            var last = row[row.length - 1];
            var next = last.right;

            if (next.equals(first)) return null;
            var newRow = [next];
            for (var c = 1; c < this.getWidth(); c++) {
                next = next.right;
                if (!this.areReflectable(next, last)) return null;
                newRow.push(next);
            }
            collection.push(newRow);
        }

        block.concatHorizontal(this.cells, collection);

        return block;
    };

    this.reflectLeft = function(){
        var block = this.clone();

        var collection = [];
        for (var r = 0; r < this.getHeight(); r++) {
            var row = this.cells[r];
            var first = row[0];
            var last = row[row.length - 1];
            var next = first.right;
            if (next.equals(last)) return null;
            var newRow = [next];
            for (var c = 1; c < this.getWidth(); c++) {
                next = next.left;
                if (!this.areReflectable(next, last)) return null;
                newRow.push(next);
            }
            collection.push(newRow);
        }

        block.concatHorizontal(collection, this.cells);

        return block;
    };

    this.reflectDown = function(){
        var block = new KvReflectingBlock(cell);

        var collection = [];
        var deepestRow = this.cells[this.cells.length - 1];
        for (var c = 0; c < deepestRow.length; c++) {
            var deepest = deepestRow[c];
            for (var r = 0; r < this.getHeight(); r++) {
                if (r >= collection.length) {
                    collection.push([]);
                }
                var collectionRow = collection[r];
                var deeper = deepest.bottom;
                if (!this.areReflectable(deepest, deeper)) {
                    return null;
                }
                collectionRow.push(deeper);
            }
        }

        block.concatVertical(this.cells, collection);

        return null;

        return block;
    };

    this.reflectUp = function(){
        var block = new KvReflectingBlock(cell);

        var collection = [];
        var highestRow = this.cells[0];
        for (var c = 0; c < highestRow.length; c++) {
            var highest = highestRow[c];
            for (var r = 0; r < this.getHeight(); r++) {
                if (r >= collection.length) {
                    collection.unshift([]);
                }
                var collectionRow = collection[0];
                var higher = highest.top;
                if (!this.areReflectable(highest, higher)) {
                    return null;
                }
                collectionRow.push(higher);
            }
        }

        block.concatVertical(collection, this.cells);
        return null;

        return block;
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
    this.list = [];

    this.enter = function(cell){
        this.list = [];
        var block = new KvReflectingBlock(cell);
        var blocks = [block];
        blocks = this.search(blocks);
        return blocks;
    };

    this.search = function(blocks) {
        var newBlocks = this.reflect(blocks);
        newBlocks = this.merge(newBlocks);

        return newBlocks;
    };


    this.reflect = function (blocks) {
        var newBlocks = [];
        for (var i = 0; i < blocks.length; i++) {
            var block = blocks[i];
            var subBlocks = block.reflect();
            console.log("==========REFLECT==========");
            console.log(block.cells);
            console.log(subBlocks);
            if (block.isDone()) {
                newBlocks.push(block);
            } else {
                newBlocks = this.reflect(subBlocks);
            }
        }

        return newBlocks;
    };

    this.merge = function (blocks) {
        var newBlocks = this.list;

        for (var i = 0; i < blocks.length; i++) {
            var insert = true;
            var block = blocks[i];
            for (var j = 0; j < newBlocks.length; j++) {
                var inserted_block = newBlocks[j];
                if (block.equals(inserted_block)) {
                    insert = false;
                    break;
                }
            }
            if (insert) {
                newBlocks.push(block);
            }
        }
        return newBlocks;
    };
};

