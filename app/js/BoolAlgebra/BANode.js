/**
 * Created by Sergej on 12.10.2016.
 */
var BANode = function(params){
    this.value = params ? params.value : null;
    this.child1 = params ? params.child1 : null;
    this.child2 = params ? params.child2 : null;
    this.parent = params ? params.parent : null;
    this.isClips = params ? params.isClips : false;
    this.subTree = params ? params.subTree : null;
    this.parent = null;

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
    
    this.isGroup = function(){
        return this.subTree != null || (this.parent && this.parent.isGroup());
    };

    this.isLeaf = function(){
        return !this.child1 || this.child1 == null || !this.child2 || this.child2 == null;
    };
};