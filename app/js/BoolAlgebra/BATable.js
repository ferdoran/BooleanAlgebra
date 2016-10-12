/**
 * Created by Sergej on 12.10.2016.
 */
var BATable = function(rootNode){
    var groups = [];
    var letters = [];

    var addToQueue = function(node){
        if (!node) return false;

        if (node.value == "G2") {
            console.log(node);
            console.log("isGroup:" + node.isGroup());
            console.log("isRoot:" + node.isRoot());
        }
        if (node.isRoot()) {
        }
        else if (node.isGroup()) {
            var groupNode = node.subTree.getRoot();

            if (groups.indexOf(node.value) < 0) {
                //groups.push(node.value);
            }

            addToQueue(groupNode);
        }
        else if (node.value != SYMBOL_AND && node.value != SYMBOL_OR && node.value != SYMBOL_IMPL) {

            if (letters.indexOf(node.value) < 0) {
                letters.push(node.value);
            }


        }
        addToQueue(node.child2);
        addToQueue(node.child1);
    };

    addToQueue(rootNode);
    console.log(rootNode);

    this.getTheadData = function(){
        return {groups: groups, letters: letters};
    };
};