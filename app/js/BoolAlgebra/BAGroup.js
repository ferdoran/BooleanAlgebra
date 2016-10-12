/**
 * Created by Sergej on 12.10.2016.
 */
var BAGroup = function(text){
    this.expression = new BAExpression(text);
    this.key = '';
    this.text = text;

    this.isValid = function(){
        return this.expression.isValid();
    };
    this.getHtml = function(){
        return this.expression.getHtml();
    };
};