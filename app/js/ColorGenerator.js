/**
 * Created by Sergej on 16.01.2017.
 */
var ColorGenerator = {
    generate: function(from, to){
        if (!from) from = 0;
        if (!to) to = 255;
        var r = Math.rnd(from, to);
        var g = Math.rnd(from, to);
        var b = Math.rnd(from, to);
        return '#' + r.toString(16) + g.toString(16) + b.toString(16);
    }
};