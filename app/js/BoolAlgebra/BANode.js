/**
 * Created by Sergej on 12.10.2016.
 */
var BANode = function(params){
    this.value = params ? params.value : null;
    this.child1 = params ? params.child1 : null;
    this.child2 = params ? params.child2 : null;
    this.parent = params ? params.parent : null;
    this.isClips = params ? params.isClips : false;
    //this.subTree = params ? params.subTree : null;
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
        } else if (!this.isRoot() && this.isGroup()) {
            value = '<span class="expr group">' + value + '</span>';
        } else {
            var childA = this.child1 ? this.child1.getHtml() : '';
            var childB = this.child2 ? this.child2.getHtml() : '';

            var Class = value == SYMBOL_AND || value == SYMBOL_IMPL || value == SYMBOL_OR ? 'op' : 'expr';

            value = childA + '<span class="'+ Class +'">'+value+'</span>' + childB;
        }

        return this.isClips ? '(' + value + ')' : value;
    };
    
    this.isGroup = function(){
        return this.group != null;
    };

    this.isLeaf = function(){
        return !this.isGroup() && (!this.child1 || this.child1 == null || !this.child2 || this.child2 == null);
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