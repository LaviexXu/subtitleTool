/**
 * Created by Carlos on 02/08/2017.
 */
function stringToTime(timeString) {
    var firstColon = timeString.indexOf(":");
    var secondColon = timeString.indexOf(":", firstColon + 1);
    var hour = timeString.substring(0, firstColon);
    var minute = timeString.substring(firstColon + 1, secondColon);
    var second = timeString.substring(secondColon + 1, timeString.length);
    hour = parseFloat(hour);
    minute = parseFloat(minute);
    second = parseFloat(second);
    return hour * 3600 + minute * 60 + second;
}

function displayTime(currentTime) {
    var hour = Math.floor(currentTime / 3600);
    var minute = Math.floor((currentTime - hour * 3600) / 60);
    var second = currentTime - hour * 3600 - minute * 60;
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
        second = "0" + second.toFixed(3);
    }
    else
        second = second.toFixed(3);
    var currentTimeString = hour + ":" + minute + ":" + second;
    return currentTimeString;
}