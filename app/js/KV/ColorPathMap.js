/**
 * Created by Sergej on 11.01.2017.
 */
var ColorPathBlockGroup = function(startCell){
    this.cells = [];
    this.start = startCell;
    this.end = null;
    this.add = function(cell) {
        this.cells.push(cell);
    };

    this.split = function(){
        var splitIndex = Math.previousPowerOfTwo(this.cells.length) - 1;

        console.log("splitIndex: " + splitIndex);
        return [this]; // TODO
    };

    this.isValid = function(){
        return Math.isPowerOfTwo(this.cells.length);
    };
};
var ColorPathBlockGroups = function(cells){
    var groups = [];

    var visited = [];

    this.stopAt = function(cell, startCell){
        if (!cells.contains(cell) || visited.contains(cell)) return true;
        if (startCell.value != cell.value) return true;

        visited.push(cell);
        return false;
    };
    this.startAt = function(startCell) {
        if (!cells.contains(startCell) || visited.contains(startCell)) return null;

        var nextCell = startCell;
        var group = new ColorPathBlockGroup(startCell);

        while (true) {
            if (this.stopAt(nextCell, startCell)) {
                group.end = nextCell.left;
                break;
            } else {
                group.add(nextCell);
                nextCell = nextCell.right;
            }
        }
        return group;
    };
    this.init = function(){
        value = cells[0].value;
        groups = [];
        for (var i = 0; i < cells.length; i++) {
            var group = this.startAt(cells[i]);
            if (group != null) {
                if (group.isValid()) {
                    groups.push(group);
                } else {
                    var subgroups = group.split();
                    for (var j = 0; j < subgroups.length; j++) {
                        groups.push(subgroups[j]);
                    }
                }
            }
        }
    };
    this.init();

    this.getGroups = function(){
        return groups;
    };
};
var ColorPath = function(startCell, color) {
    this.color = color;
    this.start = startCell;
    this.end = startCell;
    this.type = null;

    var cells = [];
    var spotType = function(startBlock, endBlock){
        console.log(startBlock);
        console.log(endBlock);
    };

    var compare_n = function(a,b) {
        if (a.n < b.n)
            return -1;
        if (a.n > b.n)
            return 1;
        return 0;
    };

    this.isValid = function(){
        return Math.isPowerOfTwo(cells.length);
    };

    var calcEndIndex = function(){
        return cells.length - 1;
    };
    this.toggleCell = function(cell) {
        if (cell.value != this.start.value) return;
        cells.toggleObject(cell);

        if (cells.length == 0) {
            this.start = this.end = null;
        } else if (cells.length == 1) {
            this.start = this.end = cells[0];
        } else {
            cells.sort(compare_n);
            this.start = cells[0];
            this.end = cells[calcEndIndex()];
        }

        return cells.length;
    };
    this.toggleCell(startCell);

    var calcBlockPos = function(n, w) {
        var pos = {x: 0, y: parseInt(n / w)};
        pos.x = n - pos.y * w;
        return pos;
    };

    var createBlocks = function(_cells){
        var blocks = [];

        return blocks;
    };

    this.createRects = function(w, size){
        var pathGroups = new ColorPathBlockGroups(cells);
        var groups = pathGroups.getGroups();
        var rects = [];

        for (var i = 0; i < groups.length; i++) {
            var group = groups[i];
            var startBlock = calcBlockPos(group.start.n, w);
            var endBlock = calcBlockPos(group.end.n, w);

            var width = endBlock.x - startBlock.x + 1;
            var height = endBlock.y - startBlock.y + 1;

            rects.push({
                x: size * startBlock.x,
                y: size * startBlock.y,
                width: width * size,
                height: height * size
            });
        }

        return rects;
    };
};
var ColorPathMap = function(){
    this.canvas = null;
    this.diagram = null;

    var paths = [];
    this.getPathInfoWithColor = function(color) {
        for (var i = 0; i < paths.length; i++) {
            var path = paths[i];
            if (path.color == color) {
                return {path: path, index: i};
            }
        }
        return {path: null, index: -1};
    };

    this.config = function(canvas, diagram) {
        this.canvas = canvas;
        this.diagram = diagram;
    };

    this.resetCanvas = function(){
        this.canvas.clearColorContainer();
        for (var i = 0; i < paths.length; i++) {
            var path = paths[i];
            var rects = path.createRects(this.diagram.getWidth(), KVDiagram.SIZE);
            for (var j = 0; j < rects.length; j++) {
                var rect = rects[j];
                this.canvas.addToColorContainer(path.color, rect.x, rect.y, rect.width, rect.height);
            }

        }
    };

    this.analyze = function(cell, color){
        var pathInfo = this.getPathInfoWithColor(color);
        var path = pathInfo.path || null;
        var index = pathInfo.index || -1;

        if (path == null) {
            paths.push(path = new ColorPath(cell, color));
        } else {
            if (path.toggleCell(cell) == 0) {
                paths.remove(path);
            }
        }

        this.resetCanvas();
    };
};