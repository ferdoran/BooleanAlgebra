var BAKV = function (params) {
    var $this = this;
    this.diagram = null;
    this.colorMap = new ColorPathMap();

    this.canvas = null;
    this.resolutionCanvas = null;

    var selectColor = null;

    this.expression = params.expression;

    this.setCanvas = function(target, solutionTarget){
        var canvasInterface = CanvasInterface.use("EaselJS");
        this.canvas = canvasInterface.create(target);
        this.solutionCanvas = canvasInterface.create(solutionTarget);

        this.canvas.onBlockClick = function(parm){
            if (selectColor != null) {
                var blocks = $this.colorMap.analyze(parm.cell, selectColor);
                $this.canvas.clearColorContainer();
                $this.diagram.colorBlocks(blocks);
            }
        };
    };
    this.setCanvas(params.target, params.solutionTarget);

    this.setSelectColor = function(color) {
        selectColor = color;
        this.canvas.setHoverColor(color);
    };

    this.setExpression = function (expr) {
      this.expression = expr;
    };

    this.resizeCanvas = function(){
        var view = this.diagram.calcView();
        this.canvas.setSize(view.width, view.height);
    };

    this.generateKV = function() {
        this.diagram = new KVDiagram(this.expression, this.canvas);
        this.resizeCanvas();
        this.colorMap.clear();
        this.colorMap.config(this.canvas, this.diagram);
        this.canvas.clearColorContainer();
        this.canvas.refresh();
    };

    var minimizeInfo = null;
    this.minimize = function(){
        return minimizeInfo = this.diagram.minimize();
    };

    this.showSolution = function () {
        this.canvas.copyIntoCanvas(this.solutionCanvas);

        this.solutionCanvas.refresh();
    };

    this.colorMinimized = function(type){
        if (minimizeInfo == null) return;
        this.diagram.colorBlocks(minimizeInfo[type].blocks);
    };

    this.refresh = function(){
        this.canvas.refresh();
    };
};