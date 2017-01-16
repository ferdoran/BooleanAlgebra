/**
 * Created by Sergej on 11.01.2017.
 */
var EaselInterface = {
    create: function(id) {
        var canvas = document.getElementById(id);

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

        var hoverContainer = new createjs.Container();
        hoverContainer.name = "hoverContainer";
        hoverContainer.x = hoverContainer.y = 0;

        var hoverBlock = new createjs.Shape();
        hoverBlock.x = hoverBlock.y = 0;
        hoverBlock.alpha = 0;

        hoverContainer.addChild(hoverBlock);

        stage.addChild(blockContainer);
        stage.addChild(colorContainer);
        stage.addChild(hoverContainer);

        const HALFSIZE = KVDiagram.SIZE / 2;
        const FOURSIZE = KVDiagram.SIZE / 4;

        const roundFactor = 5;
        canvas.colorBlock = function(block, color, x, y, width, height) {
            block.graphics.setStrokeStyle(2).beginStroke(color).drawRoundRect(x,y, width - 1, height - 1, roundFactor).endStroke();
        };
        var openDownBlock = function(block, color, x, y, width, height){
            var g = block.graphics.setStrokeStyle(2), s = 0;
            g.beginStroke(color).moveTo(x, y + height - HALFSIZE).lineTo(x,y + roundFactor).quadraticCurveTo(x,y,s = x + roundFactor,y).endStroke();
            g.beginStroke(color).moveTo(s, y).lineTo(s = x + width - roundFactor, y).endStroke();
            g.beginStroke(color).moveTo(s, y).quadraticCurveTo(s = x+width,y,s,y + roundFactor).endStroke();
            g.beginStroke(color).moveTo(s, y + roundFactor).lineTo(x+width, y+height - HALFSIZE).endStroke();
        };
        var openUpBlock = function(block, color, x, y, width, height){
            var g = block.graphics.setStrokeStyle(2), s, h = y + height;
            g.beginStroke(color).moveTo(x, y + HALFSIZE).lineTo(x,h - roundFactor).quadraticCurveTo(x,h,s = x + roundFactor,h).endStroke();
            g.beginStroke(color).moveTo(s, h).lineTo(s = x + width - roundFactor, h).endStroke();
            g.beginStroke(color).moveTo(s, h).quadraticCurveTo(s = x + width,h,s = x + width, h - roundFactor).endStroke();
            g.beginStroke(color).moveTo(s, h).lineTo(s, y + HALFSIZE).endStroke();
        };
        var openLeftBlock = function(block, color, x, y, width, height){
            var g = block.graphics.setStrokeStyle(2), s = x + width, h = y + height;
            g.beginStroke(color).moveTo(x + HALFSIZE, y).lineTo(s - roundFactor,y).quadraticCurveTo(s,y,s,y + roundFactor).endStroke();
            g.beginStroke(color).moveTo(s, y + roundFactor).lineTo(s, h).endStroke();
            g.beginStroke(color).moveTo(s, h - roundFactor).quadraticCurveTo(s,h,s = s - roundFactor,h).endStroke();
            g.beginStroke(color).moveTo(s, h).lineTo(x + HALFSIZE, h).endStroke();
        };
        var openRightBlock = function(block, color, x, y, width, height){
            var g = block.graphics.setStrokeStyle(2), s = 0, h = y + height;
            g.beginStroke(color).moveTo(x + width - HALFSIZE, y).lineTo(x + roundFactor,y).quadraticCurveTo(x,y,x,s = y + roundFactor).endStroke();
            g.beginStroke(color).moveTo(x, s).lineTo(x, s = h - roundFactor).endStroke();
            g.beginStroke(color).moveTo(x, s).quadraticCurveTo(x,h,x + roundFactor,h).endStroke();
            g.beginStroke(color).moveTo(x + roundFactor, h).lineTo(x + width - HALFSIZE, h).endStroke();
        };

        canvas.createColorBlock = function(rect) {
            var shape = new createjs.Shape();
            shape.x = rect.x;
            shape.y = rect.y;

            if (rect.open.up) {
                openUpBlock(shape, rect.block.color, 0, 0, rect.width, rect.height);
            } else if (rect.open.left) {
                openLeftBlock(shape, rect.block.color, 0, 0, rect.width, rect.height);
            } else if (rect.open.down) {
                openDownBlock(shape, rect.block.color, 0, 0, rect.width, rect.height);
            } else if (rect.open.right) {
                openRightBlock(shape, rect.block.color, 0, 0, rect.width, rect.height);
            } else {
                canvas.colorBlock(shape, rect.block.color, 0, 0, rect.width, rect.height);
            }

            return shape;
        };

        var colored_blocks = [];
        canvas.clearColoredBlocks = function(){
            colored_blocks = [];
            colorContainer.removeAllChildren();
        };

        canvas.setOffset = function(offset){
            gridOffset.x = offset.x;
            gridOffset.y = offset.y;
        };

        canvas.setHoverColor = function(color){
            canvas.colorBlock(hoverBlock, color, 8, 8, HALFSIZE, HALFSIZE);
        };

        canvas.clearColorContainer = function(){
            colorContainer.removeAllChildren();
            color_index = 0;
        };

        var color_index = 0;
        canvas.addRectsToColorContainer = function(rects){
            var colorLayer = new createjs.Container();
            colorLayer.name = "colorLayer" + (color_index++);
            colorLayer.x = gridOffset.x;
            colorLayer.y = gridOffset.y;

            for (var r = 0; r < rects.length; r++) {
                var rect = rects[r];
                var shape = canvas.createColorBlock(rect);

                colorLayer.addChild(shape);
            }
            colorContainer.addChild(colorLayer);
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
                    hoverBlock.alpha = 1;
                    hoverBlock.x = block.x;
                    hoverBlock.y = block.y;
                    canvas.onBlockHover({event: evt, block: block, label: label, button: button, background: bg, cell: block.cell});
                });
                button.addEventListener('mouseout', function(evt) {
                    hoverBlock.alpha = 0;
                    canvas.onBlockOut({event: evt, block: block, label: label, button: button, background: bg, cell: block.cell});
                });

                block.ui.bg = bg;
            }

            button.addChild(label);

            blockContainer.addChild(button);
        };

        canvas.clearChildren = function(){
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


