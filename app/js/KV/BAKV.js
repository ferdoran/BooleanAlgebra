var BAKV = function (params) {
    var $this = this;
    this.diagram = null;
    this.colorMap = new ColorPathMap();

    this.canvas = null;

    var selectColor = null;

    this.expr = params.expr;

    this.setCanvas = function(target){
        this.canvas = EaselInterface.create(target);

        this.canvas.onBlockClick = function(parm){
            if (selectColor != null) {
                var blocks = $this.colorMap.analyze(parm.cell, selectColor);
                $this.canvas.clearColorContainer();
                $this.diagram.colorBlocks(blocks);
            }
        };
    };
    this.setCanvas(params.target);

    this.setSelectColor = function(color) {
        selectColor = color;
        this.canvas.setHoverColor(color);
    };

    this.resizeCanvas = function(){
        var view = this.diagram.calcView();
        this.canvas.setSize(view.width, view.height);
    };

    this.setExpr = function(e) {
        this.expr = e;
    };

    this.generateKV = function() {
        this.diagram = new KVDiagram(this.expr, this.canvas);
        this.resizeCanvas();
        this.colorMap.config(this.canvas, this.diagram);
        this.canvas.clearColorContainer();
        this.canvas.refresh();
    };

    var minimizeInfo = null;
    this.minimize = function(){
        return minimizeInfo = this.diagram.minimize();
    };

    this.colorMinimized = function(type){
        if (minimizeInfo == null) return;
        this.diagram.colorBlocks(minimizeInfo[type].blocks);
    };

    this.refresh = function(){
        this.canvas.refresh();
    };
};