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
            canvas.refresh();
        };

        canvas.onBlockOut = function(parm) {

            canvas.refresh();
        };
    };
    this.setCanvas(params.target);

    this.setSelectColor = function(color) {
        selectColor = color;
        canvas.setHoverColor(color);
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

    var minimizeInfo = null;
    this.minimize = function(){
        return minimizeInfo = this.diagram.minimize();
    };

    this.colorMinimized = function(type){
        if (minimizeInfo == null) return;
        this.diagram.colorBlocks(minimizeInfo[type].blocks);
    };

    this.refresh = function(){
        canvas.refresh();
    };
};