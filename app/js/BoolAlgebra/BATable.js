/**
 * Created by Sergej on 12.10.2016.
 */
var BATable = function(rootNode){
    var letters = [];
    var groups = [];

    this.ths = [];
    this.bits = [];

    this.isLoading = false;

    var loadGroups = function(){
        groups.clear();
        for (var i = 0; i < BAGroup.groups.length; i++) {
            var g = BAGroup.groups[i];
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

    this.build = function(){
        this.isLoading = true;
        loadGroups();
        letters.clear();
        searchLetter(rootNode);
        this.isLoading = false;
    };
    this.build();

    this.updateView = function(){
        this.isLoading = true;
        this.ths.clear();
        this.bits.clear();

        var i;
        for (i = 0; i < letters.length; i++) {
            this.ths.push({name: letters[i], class: 'letters'});
        }
        for (i = 0; i < groups.length; i++) {
            this.ths.push({name: groups[i], class: 'groups'});
        }
        this.ths.push({name: 'F', class:'result'});

        var lettersCount = letters.length;
        var max = Math.pow(2, lettersCount);

        for (var l = 0; l < max; l++) {
            var bitLine = { letters: [], groups: [], clips: [] };

            var lTemp = l;
            for (i = lettersCount - 1; i >= 0; i--) {
                var v = 0;
                var vTemp = Math.pow(2,i);

                if (lTemp >= vTemp) {
                    lTemp -= vTemp;
                    v = 1;
                }
                bitLine.letters.push({value: v});
            }

            for (i = 0; i < groups.length; i++) {
                bitLine.groups.push({value: 0});
            }

            bitLine.result = {value: 0};
            this.bits.push(bitLine);
        }
        this.isLoading = false;
    };
};