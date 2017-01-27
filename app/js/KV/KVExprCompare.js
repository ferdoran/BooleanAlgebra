/**
 * Created by Sergej on 18.01.2017.
 */
var KVExprCompare = function(expression){
    this.expression = expression;
    this.setExpression = function(expr) {
        this.expression = expr;
    };
    this.getText = function () {
        return this.expression.text;
    };

    this.equals = function(compare){
        if (!compare) return false;
        if (compare.getText() == this.getText()) return true;

        var compTable = compare.expression.generateTable();
        compTable.updateView();
        var thisTable = this.expression.generateTable();
        thisTable.updateView();

        if (compTable.bits.length != thisTable.bits.length) return false;
        var bits = compTable.bits.length > thisTable.bits.length ? compTable.bits : thisTable.bits;
        for (var i = 0; i < bits.length; i++) {
            var bitLine = bits[i];
            var resultA = this.expression.getResult(bitLine.param);
            var resultB = compare.expression.getResult(bitLine.param);

            if (resultA != resultB) return false;
        }

        return true;
    };
};