var BAKV = function (params) {
    var $this = this;
    this.diagram = null;
    this.colorMap = new ColorPathMap();

    var canvas = null;

    var selectColor = null;

    this.setCanvas = function(target){
        canvas = EaselInterface.create(target);

        canvas.onBlockClick = function(parm){
            if (selectColor != null) {
                $this.colorMap.analyze(parm.cell, selectColor);
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
        var view = this.diagram.calcView();
        canvas.setSize(view.width, view.height);
    };


    this.generateKV = function() {
        this.diagram = new KVDiagram(params.expr, canvas);
        this.resizeCanvas();
        canvas.refresh();

        this.colorMap.config(canvas, this.diagram);
    };

    this.searchBlocks = function(){
        this.diagram.search();
    };

    this.refresh = function(){
        canvas.refresh();
    };
};