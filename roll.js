function roll_dn(sides) {

  var dn = Math.floor(Math.random() * sides + 1); // generate random number between 0 and 1
  return(dn); // show popup with a random number
  
}

function roll_4d6d1() {
  
  var arr = [roll_dn(6), roll_dn(6), roll_dn(6), roll_dn(6)]
  var min = Math.min.apply(Math, arr);
  var res = arr.reduce((a, b) => a + b, 0);
  return(res-min);

}

function point_buy(stat) {

  var t = [NaN, NaN, NaN, -9, -6, -4, -2, -1, 0, 1, 2, 3, 4, 5, 7, 9, 12, 15, 19];
  return(t[stat]);

}

module.exports = {
  roll: function(nabilities) {
    var pb_sum = 0;
    var m = "";

    for (var i=1; i<=nabilities; i=i+1) {

      // roll 4d6d1 n times and sum up their point buy costs
      var stat = roll_4d6d1();
      pb_sum = pb_sum + point_buy(stat);
      m = m + stat;

      if (i<nabilities) {
        m = m + ", ";
      }
    }

    m = m + ". Point buy value: " + pb_sum;

    return m;

  }
}

