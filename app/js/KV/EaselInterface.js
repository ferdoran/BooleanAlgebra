/**
 * Created by Sergej on 11.01.2017.
 */
var EaselInterface = {
    create: function(id) {
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

        const labelColor = '#333';

        var stage = new createjs.Stage(id);
        /*createjs.Touch.enable(stage);*/
        stage.name = "stage";
        stage.enableMouseOver(20);

        var colorContainer = new createjs.Container();
        colorContainer.name = "colorContainer";
        colorContainer.x = colorContainer.y = 0;
        var gridOffset = {x: 0, y: 0};

        var blockContainer = new createjs.Container();
        blockContainer.name = "blockContainer";
        blockContainer.x = blockContainer.y = 0;

        stage.addChild(blockContainer);
        stage.addChild(colorContainer);

        canvas.setOffset = function(offset){
            gridOffset.x = offset.x;
            gridOffset.y = offset.y;
        };

        canvas.clearColorContainer = function(){
            colorContainer.removeAllChildren();
        };
        canvas.addToColorContainer = function(color, x, y, width, height) {
            /* Optische Korrektur */
            var cFactor = KVDiagram.SIZE / 4;
            var cFactor2 = KVDiagram.SIZE / 2;
            x += cFactor + gridOffset.x;
            y += cFactor + gridOffset.y;
            width -= cFactor2;
            height -= cFactor2;

            var rect = new createjs.Shape();
            rect.x = x;
            rect.y = y;
            rect.alpha = 0.5;
            rect.graphics.beginFill(color).drawRoundRect(0, 0, width, height, 5).endFill();

            colorContainer.addChild(rect);
        };

        canvas.add = function(block) {

            var label = new createjs.Text(block.value, "20px Arial", labelColor);
            label.colors = {
                normal: labelColor,
                error: 'red'
            };
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

            if (block instanceof KVBlock){
                var bg = new createjs.Shape();
                bg.overColor = '#ddd';
                bg.outColor = "white";

                bg.graphics.beginFill(bg.outColor).beginStroke('black').drawRect(0, 0, block.width, block.height);
                button.addChild(bg);

                button.addEventListener('click', function(evt){
                    canvas.onBlockClick({event: evt, block: block, label: label, button: button, background: bg, cell: block.cell});
                });
                button.addEventListener('mouseover', function(evt) {
                    /*if (!hoverOverlay._fill) {
                        bg.graphics.clear().beginFill(bg.overColor).drawRect(0, 0, block.width, block.height).endFill().beginStroke('black').drawRect(0, 0, block.width, block.height);
                    }*/
                    canvas.onBlockHover({event: evt, block: block, label: label, button: button, background: bg, cell: block.cell});
                });
                button.addEventListener('mouseout', function(evt) {
                    /*if (!hoverOverlay._fill) {
                        bg.graphics.clear().beginFill(bg.outColor).drawRect(0, 0, block.width, block.height).endFill().beginStroke('black').drawRect(0, 0, block.width, block.height);
                    }*/
                    canvas.onBlockOut({event: evt, block: block, label: label, button: button, background: bg, cell: block.cell});
                });

                block.ui.bg = bg;
            }

            button.addChild(label);

            blockContainer.addChild(button);
        };

        canvas.placeOverlay = function(block, color) {
            var overlay = new createjs.Shape();
            overlay.alpha = 0.35;
            overlay.graphics.beginFill(color).drawRoundRect(8, 8, 16, 16, 5).endFill();
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
            blockContainer.removeAllChildren();
        };

        canvas.onBlockHover = function(block){};
        canvas.onBlockClick = function(block){};

        canvas.setSize = function(width, height) {
            stage.canvas.width = width;
            stage.canvas.height = height;
        };

        canvas.refresh = function(force){
            stage.update();
        };


        return canvas;
    }

};