/**
 * Created by Sergej on 11.01.2017.
 */
var ColorPath = function(ownerCell, color) {
    this.color = color;
    this.ownerCell = ownerCell;
    this.push = function(cell) {
        console.log("PUSH " + cell.n);
        // KOORDINATEN MERKEN
    };
};
var ColorPathMap = function(canvas){
    var visitedCells = [];
    this.start = function(cell, color) {
        if (!(color in visitedCells)) {
            visitedCells[color] = [];
        } else {
            if (visitedCells[color].contains(cell)) {
                return false;
            }
        }
        visitedCells[color].push(cell);
        var path = new ColorPath(cell, color);
        next(cell.right, path);
    };

    var next = function(cell, path) {
        if (cell.value != path.ownerCell.value || cell.colors.contains(path.color)) {
            return false;
        }

    };
};