export function NumberFormat(number, decimals, dec_point, thousands_sep) {
    number = number * 1; //makes sure `number` is numeric value
    var str = number.toFixed(decimals ? decimals : 0).toString().split('.');
    var parts = [];
    for (var i = str[0].length; i > 0; i -= 3) {
        parts.unshift(str[0].substring(Math.max(0, i - 3), i));
    }
    str[0] = parts.join(thousands_sep ? thousands_sep : ',');
    str = str.join(dec_point ? dec_point : '.')
    str = str.replace("-.", "-");
    return str;
};
