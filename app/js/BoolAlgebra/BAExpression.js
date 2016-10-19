/**
 * Created by Sergej on 12.10.2016.
 */
var BAExpression = function(text) {
    text = text.replaceAll(' ','');

    var $this = this;


    this.rootNode = null;
    this.text = '';

    this.errors = [];

    var kNumber = 1;

    var priorSplit = [
        SYMBOL_EQUAL,
        SYMBOL_IMPL,
        SYMBOL_OR,
        SYMBOL_AND
    ];

    var pushError = function(msg, detail){
        $this.errors.push({text: msg, detail: detail});
    };

    var getClips = function(text) {
        var startIndex = 0,
            count = 0,
            match,
            clip,
            clips = [],
            re = BAExpression.regex.clips;
        while ((match = re.exec(text)) !== null) {
            if (count++ >= 99999) {
                /* Unerwartete Dauerschleife verhindern */
                console.log("MATCH ERROR");
                return false;
            }
            if (kNumber >= 99999) {
                console.log("KNUMBER ERROR");
                return false;
            }
            var m = match[0];
            clip = {
                key: "K" + kNumber++,
                raw: m,
                start: match.index,
                end: re.lastIndex - 1
            };
            clip.text = clip.raw.substr(1, clip.raw.length - 2);

            clips.push(clip);

            startIndex += re.lastIndex;
        }

        var output = text;
        if (clips.length > 0) {
            var i;
            for (i = 0; i < clips.length; i++) {
                clip = clips[i];
                output = output.replace(clip.raw,clip.key);
            }
            var subClips = getClips(output);
            output = subClips.output;
            for (i = 0; i < subClips.clips.length; i++) {
                clips.push(subClips.clips[i]);
            }
        }
        return {input: text, output: output, clips: clips};
    };

    var splitByOperator = function(text){
        for (var i = 0; i < priorSplit.length; i++) {
            var pS = priorSplit[i];

            var index = text.indexOf(pS);
            if (index > -1) {
                var sideA = text.substring(0,index);
                var sideB = text.substring(index+1,text.length);

                return {a: sideA, b: sideB, value: pS};
            }
        }
        return {a: null, b: null, value: text};
    };

    var clipStack;
    var getClip = function(key) {
        var vKey = key.replace(SYMBOL_NEG, '');
        if (vKey.length < 2) return null;
        for (var i = 0; i < clipStack.length; i++) {
            var clip = clipStack[i];
            if (clip.key == vKey) {
                return clip;
            }
        }
        return null;
    };
    var searchClipKey = function(text) {
        var re = BAExpression.regex.clipname;
        if ((match = re.exec(text)) !== null) {
            return match[0];
        }
        return null;
    };
    this.buildTree = function(text) {
        if (text == null) return null;
        var clip = getClip(text);

        if (clip) {
            text = clip.text;
        } 

        var group = BAGroup.get(text);

        var splitInfo = splitByOperator(text);

        if (splitInfo.length <= 1) {
            console.log(text);
        }

        var node = new BANode({
            value: splitInfo.value,
            isClips: clip ? true : false,
            child1: this.buildTree(splitInfo.a),
            child2: this.buildTree(splitInfo.b),
            group: group
        });
        if (node.child1) {
            node.child1.parent = node;
        }
        if (node.child2) {
            node.child2.parent = node;
        }

        return node;
    };
    this.findChild = function(value) {
        return this.rootNode.findChild(value);
    };
    this.parse = function(text) {
        text = text.toUpperCase();
        this.text = text;

        var clips = getClips(text);
        clipStack = clips.clips;

        if (this.errors.length > 0) {
            console.log("=====ERROR====");
            console.log(this.errors);
            console.log("==============");
        }

        this.rootNode = this.buildTree(clips.output);
    };
    if (text) {
        this.parse(text);
    }
    this.isValid = function(){
        if (this.text.length == 0) return true;
        return (this.errors.length == 0 && this.rootNode != null);
    };
    this.getText = function(){
        return this.text;
    };
    this.getHtml = function(){
        return this.rootNode ? this.rootNode.getHtml() : '';
    };
    this.groupFilter = function(group) {
        return this.text.replaceAll(group.getText(), group.key);
    };
    this.getResult = function(param){
        return this.rootNode.getResult(param);
    };
    this.useGroup = function(group) {
        var text = this.groupFilter(group);
        if (text != this.text) {
            this.parse(text);
            this.updateInput();
            return true;
        }
        return false;
    };
    this.unuseGroup = function(group) {
        var text = this.text.replaceAll(group.key, group.getText());
        if (text != this.text) {
            this.parse(text);
            this.updateInput();
            return true;
        }
        return false;
    };
    this.updateInput = function(){
        if (this.$input) {
            this.$input.html(this.getHtml());
        }
    };

    this.useAllGroups = function(){
        if (this.rootNode.isGroup()) return false;
        for (var i = 0; i < BAGroup.groups.length; i++) {
            var g = BAGroup.groups[i];
            BAGroup.useGroup(this,g);
        }
    };
};

BAExpression.regex = {
    clips: /(\([0|1|A-Z0-9|∨|∧|¬|⇒]*\))/g,
    clipname: /K[1-9]*/g,
    syntax: /(¬*([((A-Za-z)(1-9)*)|1|0])(∧|∨)?)*/g
};

BAExpression.validSyntax = function(text) {
    var forbChar = function(char){
        return char == SYMBOL_AND || char == SYMBOL_OR || char == SYMBOL_IMPL || char >= '1' && char <= '9';
    };
    return !(forbChar(text.charAt(0)) || forbChar(text.charAt(text.length - 1)));
};