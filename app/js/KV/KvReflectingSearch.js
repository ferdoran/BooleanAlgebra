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

    this.reflectRight = function () {
        var block = new KvReflectingBlock(cell);
        var reflectAble = true;

        var collection = [];
        for (var r = 0; r < this.getHeight(); r++) {
            var collectionRow = [];
            var rightest = this.getRightest(r);
            for (var c = 0, righter = rightest; c < this.getWidth(); c++) {
                righter = righter.right;
                if (!this.areReflectable(rightest, righter)) {
                    reflectAble = false;
                    break;
                }
                collectionRow.push(righter);
            }
            collection.push(collectionRow);
        }

        if (reflectAble) {
            block.concatHorizontal(block.cells, collection);
        }

        return block;
    };

    this.reflectLeft = function(){
        var block = new KvReflectingBlock(cell);
        var reflectAble = true;

        var collection = [];
        for (var r = 0; r < this.getHeight(); r++) {
            var collectionRow = [];
            var leftest = this.getLeftest(r);
            for (var c = 0, lefter = leftest; c < this.getWidth(); c++) {
                lefter = lefter.left;
                if (!this.areReflectable(leftest, lefter)) {
                    reflectAble = false;
                    break;
                }
                collectionRow.unshift(lefter);
            }
            collection.push(collectionRow);
        }

        if (reflectAble) {
            block.concatHorizontal(collection, block.cells);
        }

        return block;
    };

    this.reflectDown = function(){
        var block = new KvReflectingBlock(cell);
        var reflectAble = true;

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
                    reflectAble = false;
                    break;
                }
                collectionRow.push(deeper);
            }
        }

        if (reflectAble) {
            block.concatVertical(block.cells, collection);
        }
        return block;
    };

    this.reflectUp = function(){
        var block = new KvReflectingBlock(cell);
        var reflectAble = true;

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
                    reflectAble = false;
                    break;
                }
                collectionRow.push(higher);
            }
        }

        if (reflectAble) {
            block.concatVertical(collection, block.cells);
        }
        return block;
    };
};
KvReflectingBlock.debug = function(block) {
    if (block instanceof KvReflectingBlock) {
        var obj = {
            width: block.getWidth(),
            height: block.getHeight(),
            cells: block.cells
        };
        console.log(obj);
    }
};

var KvReflectingSearch = function(){};

KvReflectingSearch.Enter = function (cell) {
    var block = new KvReflectingBlock(cell);
    var blocks = [block];
    blocks = KvReflectingSearch.Search(blocks);
    return blocks;
};

KvReflectingSearch.Search = function (blocks) {
    var newBlocks = KvReflectingSearch.Reflect(blocks);
    newBlocks = KvReflectingSearch.Merge(newBlocks);

    return newBlocks;
};

KvReflectingSearch.Reflect = function (blocks) {
    var newBlocks = [];
    for (var i = 0; i < blocks.length; i++) {
        var block = blocks[i];
        var blockRight = block.reflectRight();
        var blockDown = block.reflectDown();
        var blockLeft = block.reflectLeft();
        var blockUp = block.reflectUp();

        if (blockRight) newBlocks.push(blockRight);
        if (blockDown) newBlocks.push(blockDown);
        if (blockLeft) newBlocks.push(blockLeft);
        if (blockUp) newBlocks.push(blockUp);
    }

    return newBlocks;
};

KvReflectingSearch.Merge = function (blocks) {
    var newBlocks = [];

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