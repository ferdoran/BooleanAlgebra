/**
 * Created by Sergej on 18.01.2017.
 */
var KVExprCompare = function(text){
    this.setText = function(text) {
        this.text = text;
    };
    this.setText(text);
    this.equals = function(compare){
        if (!this.text || !compare || !compare.text) return false;
        var cText = compare.text;
        console.log("COMPARE " + this.text + " WITH " + cText);
        if (this.text.length != cText.length) return false;
        var thisEtape = this.getEtape1(this.text);
        var cEtape = this.getEtape1(cText);
        if (thisEtape.length != cEtape.length) return false;

        var splitSymbol = '';
        var tE = thisEtape[0];
        var cE = cEtape[0];

        if (tE.indexOf(SYMBOL_OR) > -1 && cE.indexOf(SYMBOL_OR) > -1) {
            splitSymbol = SYMBOL_OR;
        } else if (tE.indexOf(SYMBOL_AND) > -1 && cE.indexOf(SYMBOL_AND) > -1) {
            splitSymbol = SYMBOL_AND;
        } else {
            return false;
        }

        thisEtape = this.getEtape2(thisEtape, splitSymbol);
        cEtape = this.getEtape2(cEtape, splitSymbol);

        var merge = this.getEtape3(thisEtape, cEtape);
        return merge.length == thisEtape.length;
    };

    this.getEtape3 = function(a, b) {
        var matches = [];

        var merge = function(row) {
            if (matches.indexOf(row) > -1) return;
            matches.push(row);
        };

        for (var x = 0; x < a.length; x++) {
            var rowA = a[x];
            merge(rowA);
        }
        for (var y = 0; y < b.length; y++) {
            var rowB = b[y];
            merge(rowB);
        }
        return matches;
    };

    this.getEtape2 = function (etape, splitSymbol) {
        var rtn = [];
        for (var i = 0; i < etape.length; i++) {
            var split = etape[i].split(splitSymbol);
            split.sort();
            var splitStr = '';
            for (var j = 0; j < split.length; j++) {
                splitStr += split[j];
            }
            rtn.push(splitStr);
        }
        return rtn;
    };

    this.getEtape1 = function(text){
        var re = BAExpression.regex.clips;
        var count = 0;
        var rtn = [];
        while ( (match = re.exec(text)) !== null) {
            if (count++ >= 99999) {
                return false;
            }

            var m = match[0];
            rtn.push(m.substring(1, m.length - 1));
        }
        if (rtn.length == 0) {
            rtn.push(text);
        }

        return rtn;
    };
};