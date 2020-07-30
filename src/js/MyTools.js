//忽略地球曲率影响
function getLineDis(startPoint, endPoint) {
    var x2 = (endPoint.x - startPoint.x) * (endPoint.x - startPoint.x)
    var y2 = (endPoint.y - startPoint.y) * (endPoint.y - startPoint.y);
    var dis = Math.sqrt(x2 + y2) / 1000;
    return dis.toFixed(2);
}

function sum(arr) {
    var s = 0;
    for (var i = arr.length - 1; i >= 0; i--) {
        s += Number(arr[i]);
    }
    return s;
}

module.exports = {
    getLineDis:getLineDis,
    sum:sum
}