/**
 * Created by Sergej on 12.10.2016.
 */
var BAGroup = function(text){
    this.expression = new BAExpression(text);
    this.expression.rootNode.group = this;
    this.key = '';

    this.isValid = function(){
        return this.expression.isValid();
    };
    this.getHtml = function(){
        return this.expression.getHtml();
    };
    this.getText = function(){
        return this.expression.text;
    };
};