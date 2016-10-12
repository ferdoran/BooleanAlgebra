/**
 * Created by Sergej on 12.10.2016.
 */
var BADomain = function(name){
    this.table = null;
    this.expression = null;
    this.groups = null;

    this.getTree = function(){
        return this.expression.getRoot();
    };
};