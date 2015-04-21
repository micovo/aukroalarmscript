// ==UserScript==
// @name          AukroAlarm
// @namespace     AukroAlarm
// @version       1.0.0.2
// @namespace     https://github.com/micovo/aukroalarmscript/       
// @author        Mica
// @description   Alarm script for Aukro.cz  
// @downloadURL   https://raw.githubusercontent.com/micovo/aukroalarmscript/master/aukroalarm.user.js
// @updateURL     https://raw.githubusercontent.com/micovo/aukroalarmscript/master/aukroalarm.user.js
// @include       http://aukro.cz/*
// @require       http://code.jquery.com/jquery-latest.min.js
// @require       https://raw.githubusercontent.com/bunkat/later/master/later.min.js
// @run-at        document-end
// ==/UserScript==

// contributors
//   dave-cz

var aukroAlarm = {
    alarmTime: 5*1000, // miliseconds
    refreshTime: 60*1000, // miliseconds
    secondsToEndAlarm: 3*60, // seconds
    mAlarmSound: new Audio('https://www.dropbox.com/s/opz32tj8hzzxqi1/smokealarm.mp3?dl=1'),
    watching: false,
    secondsToEnd: -1
};

//  Functions

aukroAlarm.parseSecondsToEnd = function() {
    var toEndStr = $('li.timeInfo strong').text();
    if (toEndStr.indexOf('den') > -1 || toEndStr.indexOf('dn') > -1) {
        return 24 * 60 * 60;
    }
    var timeStr = $('li.timeInfo').text().split(',')[2].substring(1, 9),
        endDate = this.parseTime(timeStr),
        nowDate = new Date();
    if (nowDate > endDate) {
        endDate = endDate.setDate(endDate.getDate()+1);   
    }
    return Math.round((endDate - nowDate)/1000);
};

aukroAlarm.setGMCookie = function (key, value) {
    GM_setValue(key, value);
};

aukroAlarm.getGMCookie = function (key, defaultValue) {
    var gotValue;
    gotValue = GM_getValue(key, null);
    if(gotValue == null){
        this.setGMCookie(key, defaultValue);
        gotValue = defaultValue;
    }
    return gotValue;
};

aukroAlarm.parseTime = function (timeStr, dt) {
    if (!dt) {
        dt = new Date();
    }
    var time = timeStr.split(':');
    dt.setHours(parseInt(time[0]));
    dt.setMinutes(parseInt(time[1]));
    dt.setSeconds(parseInt(time[2]));
    return dt;
};

aukroAlarm.isInt = function (n) {
    return (parseFloat(n) == parseInt(n, 10) && !isNaN(n));
}

//  Worker

aukroAlarm.startWorker = function () {
    var self = this;
    this.worker = later.setInterval(function () {
        self.secondsToEnd = self.parseSecondsToEnd();
        $('#secondsToEnd').text(self.secondsToEnd);
        if (self.watching && self.secondsToEnd > 0 && self.secondsToEnd < self.secondsToEndAlarm) {
            self.mAlarmSound.play();
        }
    }, this.sched);
};

aukroAlarm.stopWorker = function () {
    if(typeof this.worker.clear === 'function') {
        this.worker.clear();
    }
    delete this.worker;
};

// Init

aukroAlarm.init = function () {
    this.auctionId = window.location.href.split('.html')[0].slice(-10); // auction ID from page URL
    if (!this.isInt(this.auctionId)) {
        console.log('aukroAlarm: auctionId not found');
        return;
    }
    //later.date.localTime();
    this.sched = later.parse.text('every 1 sec');
    if (this.sched.error > -1) {
        console.log('aukroAlarm: later.parse failed');
        return;
    }
    this.watching = this.getGMCookie(this.auctionId, false);
    
    $('div#siBidForm2').append('<div id="micaContainer" style="padding:20px;"><button id="micaButton"></button>&nbsp;&nbsp;&nbsp;Do konce: <span id="secondsToEnd"></span> s, Alarm: '+this.secondsToEndAlarm+' s </div>');
    $('#micaButton').text(this.watching ? 'Zrušit sledování' : 'Sledovat');
    
    this.mAlarmSound.addEventListener('ended', function() {
        this.play();
    });
    this.startWorker();
};

//  Main

$(document).ready(function() {
    aukroAlarm.init();
});

//  Events

$(document).on( 'click', 'button#micaButton', function() {
    aukroAlarm.setGMCookie(aukroAlarm.auctionId, !aukroAlarm.watching);
    location.reload();
});
