/**
 * Created by Carlos on 26/07/2017.
 */
$(document).ready(
    initClickBind
);

function initClickBind() {
    $("#uploadVideo").click(function () {
        console.log("the chosen file path:" + $("#inputSrc").val());
        var videoPathEle = document.getElementById("inputSrc");
        var file = videoPathEle.files[0];
        if (file.type != "audio/ogg" && file.type != "video/mp4") {
            alert("the video's format is wrong please reupload");
            return;
        }
        if (file != undefined) {
            var video = document.getElementById("video");
            video.src = window.URL.createObjectURL(file);
        }
    });

    $("#inputText").change(function () {    //read the txt file into textarea via FileReader
        var subtitlePathEle = document.getElementById("inputText");
        var subtitleFile = subtitlePathEle.files[0];
        var srtTest=subtitleFile.name.indexOf(".srt");
        if (subtitleFile.type != "text/plain"&&(srtTest==-1||srtTest+4!=subtitleFile.name.length)) {
            alert("the text format is no supported");
            return;
        }
        var freader = new FileReader;
        freader.readAsText(subtitleFile);
        freader.onloadend = function (event) {
            var inputText=event.target.result;
            $("#subtitleTextArea").attr("value", inputText);
        };
        $("#inputText").val("");
    });


    $("#subtitleStartButton").click(function () {
        var startTime = document.getElementById("video").currentTime;
        if(startTime==undefined||startTime==""){
            alert("请先上传视频！");
            return;
        }
        var startTimeString = displayTime(startTime);
        console.log("select the start time:" + startTime);
        document.getElementById("startTime").innerHTML = startTimeString;
    });

    $("#subtitleEndButton").click(function () {
        var endTime = document.getElementById("video").currentTime;
        if(endTime==undefined||endTime==""){
            alert("请先上传视频！");
            return;
        }
        var endTimeString = displayTime(endTime);
        console.log("Select the end time:" + endTime);
        document.getElementById("endTime").innerHTML = endTimeString;
    });

    $(document).keydown(function (event) {
        //按键实现字幕坑位
    });
    ko.applyBindings(new subtitleUploadViewModel());
}



function searchFilter() {

    var searchContent = $("#filterInput").val();
    var searchType = $("#filterType").val();
    console.log("search content:" + searchContent);
    console.log("search type:" + searchType);

    var trList = $(".subtitleInfo");
    console.log("the length of trList:" + trList.length);
    if (searchContent == "") {
        for (var trIndex in trList) {
            trList[trIndex].style.display = "table-row";
        }
        return;
    }
    if (searchType == "id") {
        for (var trIndex in trList) {

            if (searchContent == trList[trIndex].children[0].innerHTML)
                trList[trIndex].style.display = "table-row";
            else
                trList[trIndex].style.display = "none";
        }
    }
    else if (searchType == "content") {
        for (var trIndex in trList) {
            console.log("searchFilter(item content):" + trList[trIndex].children[1].innerHTML);
            if (trList[trIndex].children[1].innerHTML.indexOf(searchContent) != -1)
                trList[trIndex].style.display = "table-row";
            else
                trList[trIndex].style.display = "none";
        }
    }
    else if(searchType=="time"){
        var searchTime=stringToTime(searchContent);
        for (var trIndex in trList) {
            var startTimeString=trList[trIndex].children[2].innerHTML;
            var endTimeString=trList[trIndex].children[3].innerHTML;
            if(startTimeString==""||endTimeString=="")
                continue;
            console.log("searchFilter(item content):" + trList[trIndex].children[1].innerHTML);
            if (stringToTime(startTimeString)<=searchTime&&searchTime<=stringToTime(endTime))
                trList[trIndex].style.display = "table-row";
            else
                trList[trIndex].style.display = "none";
        }
    }
}



