/**
 * Created by Sergej on 12.10.2016.
 */
var BATable = function(rootNode){
    var letters = [];
    var groups = [];

    var loadGroups = function(){
        for (var i = 0; i < BAExpression.groups.length; i++) {
            var g = BAExpression.groups[i];
            groups.push(g.key);
        }
    };
    var searchLetter = function(node){
        if (!node) return false;

        if (node.isGroup() && !(node.child1 || node.child2)){
            searchLetter(node.group.expression.rootNode);
        }
        else if (!node.isLeaf()) {
            searchLetter(node.child1);
            searchLetter(node.child2);
        } else {
            if (letters.indexOf(node.value) < 0) {
                letters.push(node.value);
            }

        }
    };

    loadGroups();
    searchLetter(rootNode);

    this.getTheadData = function(){
        return {groups: groups, letters: letters};
    };
};