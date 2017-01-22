/**
 * Created by Sergej on 11.01.2017.
 */
var KVCell = function(value, Vars){
    this.value = value || 0;
    this.assignedVars = Vars || {};
    this.n = -1;
    this.visited = false;

    var varLength = Vars ? Object.keys(Vars).length : 0;
    this.getVarLength = function () {
        return varLength;
    };
    this.addVar = function(char, value){
        this.assignedVars[char] = value;
        varLength++;
    };
    this.equals = function(col) {
        return this.n == col.n;
    };
    this.getVarAtIndex = function(index){
        var i = 0;
        for (var property in this.assignedVars) {
            if (index == i) {
                return {key: property, value: this.assignedVars[property]};
            }
            i++;
        }
        return null;
    };
    var varsStr = "";
    this.getVarsAsString = function(){
        if (varsStr.length > 0) return varsStr;
        for (var property in this.assignedVars) {
            var value = this.assignedVars[property];
            var Var = (value == 0 ? SYMBOL_NEG : '') + property;
            varsStr += Var;
        }
        return varsStr;
    };
    this.getVarAtIndexStr = function(index){
        var Var = this.getVarAtIndex(index);
        return (Var.value == 0 ? SYMBOL_NEG : '') + Var.key;
    };
    this.clone = function(){
        var vars = {};
        for (var property in this.assignedVars) {
            vars[property] = this.assignedVars[property];
        }
        return new KVCell(this.value, vars);
    };
};

KVCell.compare = function(a,b) {
    if (a.n < b.n)
        return -1;
    if (a.n > b.n)
        return 1;
    return 0;
};