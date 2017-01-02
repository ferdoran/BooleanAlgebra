/**
 * Created by Sergej on 30.12.2016.
 */
var CanvasInterface = {
    createEasel: function(id) {
        var canvas = document.getElementById(id);

        var hoverOverlay = null;

        if (canvas.tagName != "CANVAS") {
            var c = document.createElement("CANVAS");
            var cName = id + "_canvas";
            c.setAttribute("id", cName);
            canvas.appendChild(c);
            canvas = c;
            id = cName;
        }

        var stage = new createjs.Stage(id);
        stage.name = "stage";
        stage.enableMouseOver(20);

        canvas.add = function(block) {
            var label = new createjs.Text(block.value, "20px Arial", "#333");
            label.textAlign = "center";
            label.textBaseline = "middle";
            label.x = block.width / 2;
            label.y = block.height / 2;

            var button = new createjs.Container();
            button.name = "block_" + block.x + "_" + block.y;
            button.x = block.x;
            button.y = block.y;

            block.ui = {
                label: label,
                button: button
            };

            if (block.cell){
                var bg = new createjs.Shape();
                bg.overColor = '#ddd';
                bg.outColor = "white";

                bg.graphics.beginFill(bg.outColor).beginStroke('black').drawRect(0, 0, block.width, block.height);
                button.addChild(bg);

                button.addEventListener('click', function(evt){
                    canvas.onBlockClick({event: evt, block: block, label: label, button: button, background: bg});
                });
                button.addEventListener('mouseover', function(evt) {
                    if (!hoverOverlay._fill) {
                        bg.graphics.clear().beginFill(bg.overColor).drawRect(0, 0, block.width, block.height).endFill().beginStroke('black').drawRect(0, 0, block.width, block.height);
                    }
                    canvas.onBlockHover({event: evt, block: block, label: label, button: button, background: bg});
                });
                button.addEventListener('mouseout', function(evt) {
                    if (!hoverOverlay._fill) {
                        bg.graphics.clear().beginFill(bg.outColor).drawRect(0, 0, block.width, block.height).endFill().beginStroke('black').drawRect(0, 0, block.width, block.height);
                    }
                    canvas.onBlockOut({event: evt, block: block, label: label, button: button, background: bg});
                });

                block.ui.bg = bg;
            }

            button.addChild(label);


            stage.addChild(button);
        };

        canvas.placeOverlay = function(block, color) {
            var overlay = new createjs.Shape();
            overlay.alpha = 0.35;
            overlay.graphics.beginFill(color).drawRect(8, 8, 16, 16).endFill();
            overlay.x = block.x;
            overlay.y = block.y;

            stage.addChild(overlay);
        };
        canvas.createHoverOverlay = function(){
            if (hoverOverlay == null) {
                hoverOverlay = new createjs.Shape();
                hoverOverlay.alpha = 0.35;
                hoverOverlay.x = 0;
                hoverOverlay.y = 0;
                hoverOverlay._fill = null;
                canvas.setHoverOverlayStyle(null);
                stage.addChild(hoverOverlay);
            }
        };
        canvas.setHoverOverlayStyle = function(fill) {
            hoverOverlay._fill = fill;
            if (fill == null) {
                fill = 'transparent';
            }

            canvas.createHoverOverlay();

            hoverOverlay.graphics.clear().beginFill(fill).drawRect(8, 8, 16, 16).endFill();
            canvas.refresh();
        };
        canvas.setHoverOverlayPosition = function(x, y) {
            canvas.createHoverOverlay();
            hoverOverlay.x = x;
            hoverOverlay.y = y;
        };

        canvas.clearChildren = function(){
            hoverOverlay = null;
            stage.removeAllChildren();
        };

        canvas.onBlockHover = function(block){};
        canvas.onBlockClick = function(block){};

        canvas.setSize = function(width, height) {
            stage.canvas.width = width;
            stage.canvas.height = height;
        };

        canvas.refresh = function(force){
            if (hoverOverlay != null) {
                stage.setChildIndex( hoverOverlay, stage.getNumChildren()-1);
            }
            stage.update();
        };


        return canvas;
    },

    createPixi: function(id) {
        var renderer = PIXI.autoDetectRenderer(1, 1,{backgroundColor : 0xF5F5F5});
        var container = document.getElementById(id);
        container.appendChild(renderer.view);
        renderer.view.backgroundColor = 0xF5F5F5;

        var stage = new PIXI.Container();

        var testText = new PIXI.Text("TEST");
        testText.x = 32;
        testText.y = 32;

        stage.addChild(testText);

        return {
            setSize: function(width, height) {
                renderer.view.width = width;
                renderer.view.height = height;
            },
            clearChildren: function(){},
            add: function(){},
            refresh: function(){}
        };
    },

    createSvg: function(id) {
        const NS = "http://www.w3.org/2000/svg";
        var svg = document.getElementById(id);
        if (svg.tagName != "SVG") {
            var c = document.createElementNS(NS, "svg");
            var cName = id + "_svg";
            c.setAttribute("id", cName);
            svg.appendChild(c);
            svg = c;
            id = cName;
        }


        svg.add = function(block) {
            var rect = document.createElementNS(NS, "rect");
            rect.setAttribute("x", block.x);
            rect.setAttribute("y", block.y);
            rect.setAttribute("width", block.width);
            rect.setAttribute("height", block.height);
            var fill = block.cell ? "fill:white;stroke-width:1;stroke:black;" : "fill:transparent;stroke-width:0;";
            rect.setAttribute("style", fill);

            var text = document.createElementNS(NS, "text");
            text.setAttribute("x", "0");
            text.setAttribute("y", "0");
            text.setAttribute("fill", "black");
            var textNode = document.createTextNode(block.value);
            text.appendChild(textNode);

            rect.appendChild(text);

            svg.appendChild(rect);
        };
        svg.setSize = function(width, height) {
            svg.setAttribute('width', width);
            svg.setAttribute('height', height);
        };
        svg.clearChildren = function(){
            while (svg.firstChild) {
                svg.removeChild(svg.firstChild);
            }
        };
        svg.refresh = function(){};

        return svg;
    },
    createPlainCanvas: function(id){
        var canvas = document.getElementById(id);
        if (canvas.tagName != "CANVAS") {
            var c = document.createElement("CANVAS");
            var cName = id + "_canvas";
            c.setAttribute("id", cName);
            canvas.appendChild(c);
            canvas = c;
            id = cName;
        }

        var ctx = canvas.getContext('2d');

        ctx.sRect = function(x,y,w,h){
            x = parseInt(x) + 0.50;
            y = parseInt(y) + 0.50;
            this.strokeRect(x,y,w,h);
        };
        ctx.fRect = function(x,y,w,h) {
            x = parseInt(x);
            y = parseInt(y);
            this.fillRect(x,y,w,h);
        };

        canvas.isDirty = false;

        const blockHover = '#ddd';
        var lastBlock = null;
        var blocks = [];



        var isOver = function(block) {
            if (block.cell) {
                if (block != lastBlock) {
                    loseHover(block);
                }
                if (block.fill != blockHover) canvas.isDirty = true;
                block.fill = blockHover;
                lastBlock = block;
            }
        };
        var loseHover = function(block){
            if (block.cell) {
                if (block.fill != 'white') canvas.isDirty = true;
                block.fill = 'white';
            }
        };
        canvas.addEventListener('mousemove', function(e) {
            var mouse = {x: e.offsetX, y: e.offsetY};
            for (var i = 0; i < blocks.length; i++) {
                var block = blocks[i];
                loseHover(block);
                if (block.isInside(mouse)) {
                    isOver(block);
                }
            }
            canvas.refresh();
        });
        canvas.addEventListener('click', function(e){
            var mouse = {x: e.offsetX, y: e.offsetY};
            for (var i = 0; i < blocks.length; i++) {
                var block = blocks[i];
                if (block.isInside(mouse)) {
                    canvas.onBlockClick(block);
                }
            }
        });

        canvas.add = function(block) {
            blocks.push(block);
        };

        canvas.clearChildren = function(){
            blocks = [];
        };

        canvas.onBlockHover = function(block){};
        canvas.onBlockClick = function(block){};

        canvas.setSize = function(width, height) {
            canvas.width = width;
            canvas.height = height;
        };

        canvas.clear = function(){
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        };
        canvas.refresh = function(force){
            if (!canvas.isDirty && !force) return;
            canvas.clear();
            for (var i = 0; i < blocks.length; i++) {
                var block = blocks[i];
                block.draw(ctx);
            }
        };

        return canvas;
    }
};