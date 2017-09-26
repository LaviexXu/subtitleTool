/**
 * Created by Carlos on 31/07/2017.
 */


function subtitleUploadViewModel() {
    var self = this;
    self.subtitles = ko.observableArray();
    self.subtitleNearby=ko.observableArray();
    self.subtitlePrev=ko.observableArray();
    self.uploadSubtitle = function () {
        self.subtitles.removeAll();
        self.subtitleNearby.removeAll();
        var originSubtitle = $("#subtitleTextArea").val();
        $("#currentSubtitleId").val("");
        $("#currentSubtitle").val("");
        var subtitleArray = new Array();
        if($("#inputFormat").val()=="txt") {
            var currentSubtitleStart = 0;//the number of the start of current subtitle
            var currentSubtitleEnd = originSubtitle.indexOf("\n");
            var currentSubtitle;
            while (currentSubtitleEnd != -1) {
                currentSubtitle = originSubtitle.substring(currentSubtitleStart, currentSubtitleEnd);
                currentSubtitle = currentSubtitle.trim();   //strip the whitespace from both ends
                if (currentSubtitle != null && currentSubtitle != "") {
                    subtitleArray.push(currentSubtitle);  //push current subtitle into array if it has content
                }
                currentSubtitleStart = currentSubtitleEnd + 1;
                currentSubtitleEnd = originSubtitle.indexOf("\n", currentSubtitleStart);
            }
            currentSubtitle = originSubtitle.substring(currentSubtitleStart, originSubtitle.length);
            currentSubtitle = currentSubtitle.trim();
            if (currentSubtitle != null && currentSubtitle != "") {
                subtitleArray.push(currentSubtitle);
            }
            var subtitleIndex;
            for (subtitleIndex in subtitleArray) {
                self.subtitles.push(new subtitleInfo(parseInt(subtitleIndex) + 1, subtitleArray[subtitleIndex], "", ""));
            }
        }

        else if($("#inputFormat").val()=="srt"){
            var id=1;
            var curSubStart=originSubtitle.indexOf(id.toString());
            while(curSubStart!=-1){
                var stStart=originSubtitle.indexOf("\n",curSubStart)
                var stEnd=originSubtitle.indexOf("-->",stStart);
                var startTime=originSubtitle.substring(stStart,stEnd).trim();
                var etStart=stEnd+3;
                var etEnd=originSubtitle.indexOf("\n",etStart);
                var endTime=originSubtitle.substring(etStart,etEnd).trim();
                var subtitleEnd=originSubtitle.indexOf("\n\n",etEnd);
                var subtitle=originSubtitle.substring(etEnd+1,subtitleEnd).trim();
                self.subtitles.push(new subtitleInfo(id,subtitle,startTime,endTime));
                id++;
                curSubStart=originSubtitle.indexOf(id.toString(),subtitleEnd);
            }
        }
    };
    self.selectSubtitle = function () {
        console.log("current subtitle:" + this.id() + " " + this.content());
        $("#currentSubtitleId").text(this.id());
        $("#currentSubtitle").text(this.content());
        if(this.startTime()!=""){
            document.getElementById("video").currentTime=stringToTime(this.startTime());
            document.getElementById("video").pause();
        }

    };

    self.setSubtitleTime = function () {
        var setType = $("#setTimeType").val();
        var subtitleId = $("#currentSubtitleId").text();

        if ("" == subtitleId) {
            alert("请先选择字幕！");
            return;
        }
        var startTime = $("#startTime").text();
        var endTime = $("#endTime").text();
        if (startTime == "" || endTime == "") {
            alert("请先选择时间！");
            return;
        }
        subtitleId = parseInt(subtitleId) - 1;
        console.log("your current subtitle is " + self.subtitles()[subtitleId].content());

        if (setType == "both") {
            self.subtitles()[subtitleId].startTime(startTime);
            self.subtitles()[subtitleId].endTime(endTime);
        }
        else if (setType == "startTimeOnly") {
            self.subtitles()[subtitleId].startTime(startTime);
        }
        else if (setType == "endTimeOnly") {
            self.subtitles()[subtitleId].endTime(endTime);
        }
        self.subtitles.sort(isEarlyThan);
        for(var subtitleIndex in self.subtitles()){
            if(self.subtitles()[subtitleIndex].id()==(subtitleId+1).toString()){
                $("#currentSubtitleId").text((parseInt(subtitleIndex)+1));
            }
            self.subtitles()[subtitleIndex].id((parseInt(subtitleIndex)+1).toString());
        }
    };
    self.srtOutput = function () {
        //格式：序号+起始时间-->结束时间+字幕+空行
        console.log("导出为srt格式");
        var srtName=prompt("请输入导出的srt文件名","")
        if(srtName==null||srtName=="")
            return;
        var srtText = "";
        for (var subtitleSeq in self.subtitles()) {
            srtText += self.subtitles()[subtitleSeq].id() + "\n"
                + self.subtitles()[subtitleSeq].startTime()
                + " --> " + self.subtitles()[subtitleSeq].endTime() + "\n"
                + self.subtitles()[subtitleSeq].content() + "\n" + "\n";
        }
        var subtitleBlob=new Blob([srtText],{type:"text/plain;charset=utf-8"});
        saveAs(subtitleBlob,srtName+".srt");
    };

    self.displaySubtitleNearby=function () {
        self.subtitleNearby.removeAll();
        var currentTime = document.getElementById("video").currentTime;
        for(var index in self.subtitles()){
            var currentSubtitle=self.subtitles()[index];
            var startTimeString = currentSubtitle.startTime();
            var endTimeString=currentSubtitle.endTime();
            if(startTimeString==""||endTimeString=="")
                continue;
            var startTime=stringToTime(startTimeString);
            var endTime=stringToTime(endTimeString);
            if((currentTime>startTime&&currentTime<endTime)
                ||(startTime-currentTime<5&&startTime-currentTime>=0)
                ||(currentTime-endTime<5&&currentTime-endTime>=0)){
                self.subtitleNearby.push(
                    new subtitleNearbyInfo(currentSubtitle.content()));
            }
        }
    }
    self.subtitlePreview=function () {
        self.subtitlePrev.removeAll();
        var currentTime = document.getElementById("video").currentTime;
        for(var index in self.subtitles()){
            var currentSubtitle=self.subtitles()[index];
            var startTimeString = currentSubtitle.startTime();
            var endTimeString=currentSubtitle.endTime();
            if(startTimeString==""||endTimeString=="")
                continue;
            var startTime=stringToTime(startTimeString);
            var endTime=stringToTime(endTimeString);
            if((currentTime>startTime&&currentTime<endTime)
                ||(startTime-currentTime<1&&startTime-currentTime>=0)
                ||(currentTime-endTime<1&&currentTime-endTime>=0)){
                self.subtitlePrev.push(
                    new subtitleNearbyInfo(currentSubtitle.content()));
                console.log(currentSubtitle.content());
            }
        }
    }
}
function isEarlyThan(firstSub, secondSub) {
    var firstSubTimeString = firstSub.startTime();
    var secondSubTimeString = secondSub.startTime();
    if (secondSubTimeString == ""){
        if(firstSubTimeString==""){
         if(parseInt(firstSub.id())>parseInt(secondSub.id()))
             return 1;
         else
             return -1;
        }
        else
            return-1
    }

    else if (firstSubTimeString == "") {
        return 1;
    }

    else {
        var firstSubTime = stringToTime(firstSubTimeString);
        var secondSubTime = stringToTime(secondSubTimeString);
        if (firstSubTime > secondSubTime) {
            return 1;
        }
        else if (firstSubTime < secondSubTime)
            return -1;
        else
            return 0;
    }
}

function subtitleInfo(id, content, startTime, endTime) {
    var self = this;
    self.id = ko.observable(id);
    self.content = ko.observable(content);
    self.startTime = ko.observable(startTime);
    self.endTime = ko.observable(endTime);
}

/**
 * Created by Carlos on 02/08/2017.
 */


function subtitleNearbyInfo(content) {
    this.content=content;
}