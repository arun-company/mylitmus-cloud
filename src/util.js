export function toFixedNumber (number, x) {
    if (number === null) { return number }
    
    var pow = Math.pow(10,x);
    return +( Math.round(number*pow) / pow );
}