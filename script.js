function toPlaces(x, precision, maxAccepted) {
	x = new Decimal(x)
	let result = x.toStringWithDecimalPlaces(precision)
	if (new Decimal(result).gte(maxAccepted)) {
		result = new Decimal(maxAccepted-Math.pow(0.1, precision)).toStringWithDecimalPlaces(precision)
	}
	return result
}
function exponentialFormat(num, precision) {
	let e = num.log10().floor()
	let m = num.div(Decimal.pow(10, e))
	return toPlaces(m, precision, 10)+"e"+formatWhole(e)
}
function commaFormat(num, precision) {
	if (num === null || num === undefined) return "NaN"
	if (num.mag < 0.001) return (0).toFixed(precision)
	return toPlaces(num, precision, 1e9).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}
function fixValue(x, y = 0) {
	return x || new Decimal(y)
}
function sumValues(x) {
	x = Object.values(x)
	if (!x[0]) return new Decimal(0)
	return x.reduce((a, b) => Decimal.add(a, b))
}
function format(decimal, precision=2) {
	if (decimal=="X") return "X"
	decimal = new Decimal(decimal)
	if (isNaN(decimal.sign)||isNaN(decimal.layer)||isNaN(decimal.mag)) {
		player.hasNaN = true;
		return "NaN"
	}
	if (decimal.sign<0) return "-"+format(decimal.neg(), precision)
	if (decimal.mag == Number.POSITIVE_INFINITY) return "Infinity"
	if (decimal.gte("eeee10")) {
		var slog = decimal.slog()
		if (slog.gte(1e9)) return "10^^" + format(slog.floor())
		else if (slog.gte(1000)) return "10^^"+commaFormat(slog, 0)
		else return "10^^" + commaFormat(slog, 2)
	} else if (decimal.gte("e1e6")) return "e"+formatWhole(decimal.log10(), 2)
	else if (decimal.gte("1e1000")) return exponentialFormat(decimal, Math.max(3-(decimal.log10().log10().toNumber()-3), 0))
	else if (decimal.gte(1e9)) return exponentialFormat(decimal, 3)
	else if (decimal.gte(1e3)) return commaFormat(decimal, 0)
	else return commaFormat(decimal, precision)
}
function formatWhole(decimal) {
	return format(decimal, 0)
}
//END OF NUMBER FORMAT FUNCTION GROUP//

//START OF GAME SCRIPT//
//PRODUCTION//
var autocreditCost = 1
var autocredit;
var credits = new Decimal(1) //Not working lol//
var autoamount = 1
//EXPANSION//
var ticketCost = 15
var ticketAmnt = 0
setInterval(update, 1)
function update() {
    document.getElementById("credits").innerHTML = "You have "+format(credits, precision=2)+" ₡"
    document.getElementById("buyGen").innerHTML = "Buy ₡ generator <br>"+"Cost: "+format(autocreditCost, precision=2)+" ₡"
    document.getElementById("buyTicket").innerHTML = "Exchange ₡ for an Ex-tickets<br>"+"Cost: "+format(ticketCost, precision=2)+" ₡"
    document.getElementById("ticketindicator").innerHTML = format(ticketAmnt, precision=0)
}
function increaseCredit() {
    credits += 0.1
}
function buygen() {
    if (credits>=autocreditCost) {
        credits -= autocreditCost
        autocreditCost *= 1.4 
        clearInterval(autocredit)
        autoamount += 1
        autocredit = setInterval(increaseCredit, (500/autoamount))
    }
}
function buyticket() {
    if (credits>=ticketCost) {
        credits -= ticketCost
        ticketAmnt += 1
        ticketCost += 1+(ticketAmnt**1.4)
    }
}