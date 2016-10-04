/**
 * Created by Sergej Görzen on 05.09.2016.
 */
var BADomain = function(name){
    this.table = null;
    this.formula = null;
    this.groups = null;

    this.getTree = function(){
        return this.formula.getRoot();
    };
};

var BATable = function(rootNode, baGroups){
    var groups = [];
    var letters = [];
    var specials = [];
    var clips = [];

    var addToQueue = function(node){
        if (!node) return false;

        if (node.isRoot) {
        }
        else if (node.isGroup) {
            var groupNode = node.subTree.getRoot();
            addToQueue(groupNode);
            if (groups.indexOf(node.value) < 0) {
                groups.push(node.value);
            }
        }
        else if (node.value != SYMBOL_AND && node.value != SYMBOL_OR && node.value != SYMBOL_IMPL) {

            if (letters.indexOf(node.value) < 0) {
                if (node.isNegative) {
                    specials.push(node.getValue());
                }

                letters.push(node.value);
            }


        }
        addToQueue(node.child2);
        addToQueue(node.child1);
    };

    addToQueue(rootNode);

    this.getTheadData = function(){
        return {groups: groups, letters: letters, specials: specials, clips: clips};
    };
};

/*@TODO Bug: Klammern funktionieren nicht mehr!*/

var BANode = function(params){
    this.value = params ? params.value : null;
    this.child1 = params ? params.child1 : null;
    this.child2 = params ? params.child2 : null;
    this.parent = params ? params.parent : null;
    this.isRoot = false;
    this.isClips = params ? params.isClips : false;
    this.isGroup = params ? params.isGroup : false;
    this.subTree = params ? params.subTree : null;

    this.isNegative = false;
    if (this.value.charAt(0) == SYMBOL_NEG) {
        this.value = this.value.substr(1);
        this.isNegative = true;
    }

    this.isValid = function(){
        return (this.child1 && this.child2);
    };

    this.inverse = function(){
        var negNode = new BANode(params);
        negNode.child1 = null;
        negNode.child2 = null;
        negNode.isNegative = !this.isNegative;
        return negNode;
    };

    this.getValue = function(){
        return this.isNegative ? SYMBOL_NEG + this.value : this.value;
    };

    this.getHtml = function(){
        var value = this.getValue();

        if (this.isLeaf()) {
            value = '<span class="expr">' + value + '</span>';
        } else {
            var childA = this.child1.getHtml();
            var childB = this.child2.getHtml();
            value = childA + '<span class="op">'+value+'</span>' + childB;
        }

        return this.isClips ? '(' + value + ')' : value;
    };

    this.isLeaf = function(){
        return !this.child1 || this.child1 == null || !this.child2 || this.child2 == null;
    };
};

var Formula = function(text) {
    var regex = {
        clips: /(\([0|1|A-Z0-9|∨|∧|¬|⇒]*\))/g,
        validation: "(¬*([((A-Za-z)(1-9)*)|1|0])(∧|∨)?)*"
    };

    var rootNode;
    this.text = '';

    var kNumber = 1;

    var priorSplit = [
        SYMBOL_IMPL,
        SYMBOL_OR,
        SYMBOL_AND
    ];

    this.groups = [];

    var getClips = function(text) {
        var startIndex = 0,
            count = 0,
            match,
            clip,
            clips = [],
            re = regex.clips;
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

    this.buildTree = function(text,clipStack,isClip) {

        var getClip = function(key) {
            for (var i = 0; i < clipStack.length; i++) {
                var clip = clipStack[i];
                if (clip.key == key) {
                    return clip;
                }
            }
            return null;
        };

        /* Klammern auflösen */
        if (text.length >= 2) {
            var clip = getClip(text);
            if (clip != null) {
                return this.buildTree(clip.text, clipStack,true);
            }
        }

        var i;
        for (i = 0; i < priorSplit.length; i++) {
            var pS = priorSplit[i];

            var index = text.indexOf(pS);
            if (index > -1) {
                var sideA = text.substring(0,index);
                var sideB = text.substring(index+1,text.length);

                var node = new BANode({
                    value: pS,
                    isClips: isClip,
                    child1: this.buildTree(sideA,clipStack),
                    child2: this.buildTree(sideB,clipStack)
                });
                node.child1.parent = node;
                node.child2.parent = node;
                return node;
            }
        }

        var isGroup = false;
        var subTree = null;
        if (text.length >= 2) {
            var vKey = text.replace(SYMBOL_NEG, '');
            if (vKey.length >= 2) {
                for (i = 0; i < this.groups.length; i++) {
                    var group = this.groups[i];
                    if (text == group.key) {
                        isGroup = true;
                        subTree = group.formula;
                        break;
                    }
                }
            }

        }

        return new BANode({value: text, isGroup: isGroup, subTree: subTree});
    };

    this.parse = function(text) {
        text = text.toUpperCase();
        this.text = text;

        var clips = getClips(text);

        rootNode = this.buildTree(clips.output,clips.clips);
        rootNode.isRoot = true;
    };
    if (text) {
        this.parse(text);
    }


    this.getRoot = function(){
        return rootNode;
    };

    this.isValid = function(){
        return true;
        if (this.text.length == 0) return true;
        var firstChar = this.text.charAt(0);
        var lastChar = this.text.charAt(this.text.length - 1);
        return lastChar != SYMBOL_AND && lastChar != SYMBOL_OR
            && firstChar != SYMBOL_AND && firstChar != SYMBOL_OR
            && match[0] != "" && match[0] == this.text;
    };

    this.getText = function(){
        return this.text;
    };

    this.getHtml = function(){
        return rootNode.getHtml();
    };
};

var BAGroup = function(text){
    this.formula = new Formula(text);
    this.key = '';
    this.text = text;

    this.isValid = function(){
        return this.formula.isValid();
    };
    this.getHtml = function(){
        return this.formula.getHtml();
    };
};