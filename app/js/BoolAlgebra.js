/**
 * Created by Sergej Görzen on 05.09.2016.
 */
var BANode = function(params){
    this.value = params ? params.value : null;
    this.child1 = params ? params.child1 : null;
    this.child2 = params ? params.child2 : null;
    this.isRoot = false;

    this.isGroup = function() {
        return params ? params.isGroup : false;
    };

    this.isClip = function(){
        return params ? params.isClip : false;
    };

    this.isValid = function(){
        return (this.child1 && this.child2);
    };


    this.getHtml = function(){
        var value = this.value;

        if (this.isLeaf()) {
            return '<span class="expr">' + value + '</span>';
        }

        var childA = this.child1.getHtml();
        var childB = this.child2.getHtml();

        return childA + '<span class="op">'+value+'</span>' + childB;
        //return '<span class="expr">'+childA + '<span class="op">'+this.value+'</span>' + childB+'</span>';
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

    var tree;
    this.text = '';

    var kNumber = 1;

    var priorSplit = [
        SYMBOL_IMPL,
        SYMBOL_OR,
        SYMBOL_AND
    ];

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

    this.buildTree = function(text,clipStack) {

        var getClip = function(key) {
            for (var i = 0; i < clipStack.length; i++) {
                var clip = clipStack[i];
                if (clip.key == key) {
                    return clip;
                }
            }
            return null;
        };

        if (text.length == 2) {
            var clip = getClip(text);
            if (clip != null) {
                return this.buildTree(clip.text, clipStack);
            }
        }

        for (var i = 0; i < priorSplit.length; i++) {
            var pS = priorSplit[i];

            var index = text.indexOf(pS);
            if (index > -1) {
                var sideA = text.substring(0,index);
                var sideB = text.substring(index+1,text.length);

                return new BANode({
                    value: pS,
                    child1: this.buildTree(sideA,clipStack),
                    child2: this.buildTree(sideB,clipStack)
                });
            }
        }
        return new BANode({value: text});
    };

    this.parse = function(text) {
        text = text.toUpperCase();
        this.text = text;

        var clips = getClips(text);
        console.log(clips);

        tree = this.buildTree(clips.output,clips.clips);
        tree.isRoot = true;
    };
    if (text) {
        this.parse(text);
    }


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
        return tree.getHtml();

        var rtn = "";
        // Dummy - Später wird das aus dem Baum generiert
        var lastChar = '';
        for (var i = 0; i < this.text.length; i++) {
            var char = this.text.charAt(i);
            if (char == SYMBOL_AND || char == SYMBOL_NEG || char == SYMBOL_OR || char == SYMBOL_IMPL) {
                char = '<span class="op">'+char+'</span>';
            } else {
                if ((i+1) < this.text.length && char == 'G') {
                    var number = this.text.charAt(i+1);
                    var code = number.charCodeAt(0);
                    if (code >= KEY_0 && code <= KEY_9) {
                        number = '<sub>' + number + '</sub>';
                    }
                }
                char = '<span class="expr">' + char + '</span>';
            }
            rtn += char;
        }
        return rtn;
    };
};

function REX(text) {
    console.log( (new Formula(text)).isValid());
}