function roll_dn(sides) {

  var dn = Math.floor(Math.random() * sides + 1); // generate random number between 1 and sides
  return(dn);
  
}

// roll 4d6, dropping the lowest result.
function roll_4d6d1() {
  
  var arr = [roll_dn(6), roll_dn(6), roll_dn(6), roll_dn(6)]
  var min = Math.min.apply(Math, arr);
  var res = arr.reduce((a, b) => a + b, 0);
  return(res-min);

}

// lookup point buy costs
function point_buy(stat) {

  var t = [NaN, NaN, NaN, -9, -6, -4, -2, -1, 0, 1, 2, 3, 4, 5, 7, 9, 12, 15, 19];
  return(t[stat]);

}

module.exports = {
  roll: function(nabilities) {

    // roll 4d6d1 n times
    var stats = Array.apply(null, {length: nabilities}).map(Function.call, roll_4d6d1);

    var pb_sum = stats.reduce((acc, stat) => acc + point_buy(stat), 0);

    return {stats: stats, pb_sum: pb_sum};
  }

}
