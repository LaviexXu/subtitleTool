/**
 * Created by Carlos on 02/08/2017.
 */
function stringToTime(timeString) {
    var firstColon = timeString.indexOf(":");
    var secondColon = timeString.indexOf(":", firstColon + 1);
    var comma=timeString.indexOf(",");
    var hour = timeString.substring(0, firstColon);
    var minute = timeString.substring(firstColon + 1, secondColon);
    var second = timeString.substring(secondColon + 1, comma);
    var ms=timeString.substring(comma+1,timeString.length);
    hour = parseFloat(hour);
    minute = parseFloat(minute);
    second = parseFloat(second);
    ms=parseFloat(ms);
    return hour * 3600 + minute * 60 + second+ms/1000;
}

function displayTime(currentTime) {
    var hour = Math.floor(currentTime / 3600);
    var minute = Math.floor((currentTime - hour * 3600) / 60);
    var second = Math.floor(currentTime - hour * 3600 - minute * 60);
    var ms=currentTime - hour * 3600 - minute * 60 - second;
    if (hour < 10) {
        hour = "0" + hour.toString();
    }
    else
        hour = hour.toString();
    if (minute < 10) {
        minute = "0" + minute.toString();
    }
    else
        minute = minute.toString();
    if (second < 10) {
        second = "0" + second.toString();
    }
    else
        second = second.toString();
    ms=Math.floor(ms*1000).toString();
    var currentTimeString = hour + ":" + minute + ":" + second+","+ms;
    return currentTimeString;
}