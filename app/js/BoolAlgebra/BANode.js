/**
 * Created by Sergej on 12.10.2016.
 */
var BANode = function(params){
    this.value = params ? params.value : null;
    this.child1 = params ? params.child1 : null;
    this.child2 = params ? params.child2 : null;
    this.parent = params ? params.parent : null;
    this.isClips = params ? params.isClips : false;
    this.parent = null;
    this.group = params ? params.group : null;

    this.isNegative = false;
    if (this.value.charAt(0) == SYMBOL_NEG) {
        this.value = this.value.substr(1);
        this.isNegative = true;
    }

    this.isValid = function(){
        return (this.child1 && this.child2);
    };

    this.isRoot = function(){
        return this.parent == null;
    };

    this.findChild = function(value){
        if (this.value == value) { return this; }

        var child = this.child1 ? this.child1.findChild(value) : null;
        if (child != null) {
            return child;
        }

        child = this.child2 ? this.child2.findChild(value) : null;

        return child;
    };


    this.getValue = function(){
        return this.isNegative ? SYMBOL_NEG + this.value : this.value;
    };

    this.getHtml = function(){
        var value = this.getValue();

        if (this.isLeaf()) {
            value = '<span class="expr">' + value + '</span>';
        } else if (!this.isRoot() && this.isGroup() || this.isRoot() && this.isGroup() && !this.child1 && !this.child2) {
            //var width = this.group.key.length;
            value = '<span class="expr group"><span>G</span><sub>'+this.group.number+'</sub></span>';
        } else {
            var childA = this.child1 && this.child1.value != "" ? this.child1.getHtml() : '';
            var childB = this.child2 && this.child2.value != "" ? this.child2.getHtml() : '';

            var Class = value == SYMBOL_AND || value == SYMBOL_IMPL || value == SYMBOL_OR ? 'op' : 'expr';

            value = childA + '<span class="'+ Class +'">'+value+'</span>' + childB;
            //value = childA + value + childB;
        }
        //return this.isClips ? '(' + value + ')' : value;
        return this.isClips ? '<span class="expr"><span class="clips">(</span>' + value + '<span class="clips">)</span></span>' : value;
    };
    
    this.isGroup = function(){
        return this.group != null;
    };

    this.isLeaf = function(){
        return !this.isGroup() && (!this.child1 || this.child1 == null || !this.child2 || this.child2 == null);
    };

    this.negResult = function(param) {
        var result = this.getResult(param);
        return result ? 0 : 1;
    };

    this.getResult = function(param) {
        var result = 0;

        if (this.isGroup() && !this.child1 && !this.child2) {
            result = this.group.expression.rootNode.getResult(param);
        } else {
            if (IS_OPERATOR(this.value)) {
                var childA = this.child1.getResult(param);
                var childB = this.child2.getResult(param);

                switch (this.value) {
                    case SYMBOL_AND:
                        result = childA == 1 && childB == 1;
                        break;
                    case SYMBOL_OR:
                        result = childA == 1 || childB == 1;
                        break;
                    case SYMBOL_IMPL:
                        childA = childA ? 0 : 1;
                        result = childA == 1 || childB == 1;
                        break;
                }
            } else {
                for (var key in param) {
                    if (param.hasOwnProperty(key)) {
                        if (key == this.value) {
                            result = Number(param[key]);
                        }
                    }
                }
            }
        }

        if (this.isNegative) {
            result = result ? 0 : 1;
        }

        result = result ? 1 : 0;

        return result;
    };
};

function DEBUG_NODE(node) {
    console.log("===DEBUG_NODE===");
    if (node == null) {
        console.log("NODE IS NULL");
    } else {
        console.log(node);
        console.log("isLeaf: " + node.isLeaf());
        console.log("isRoot: " + node.isRoot());
        console.log("isGroup: " + node.isGroup());
        console.log("value: " + node.value);
        console.log("getHtml: " + node.getHtml());
    }
    console.log("==================");
};