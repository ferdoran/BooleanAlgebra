/**
 * Created by Sergej on 18.01.2017.
 */
var BAExprCompare = function(text){
    this.setText = function(text) {
        this.text = text;
    };
    this.setText(text);
    this.equals = function(compare){
        if (!this.text || !compare || !compare.text) return false;
        var cText = compare.text;
        if (this.text.length != cText.length) return false;
        console.log("COMPARE " + this.text + " WITH " + cText);
        return false;
    };
};