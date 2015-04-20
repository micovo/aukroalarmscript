// ==UserScript==
// @name          AukroAlarm
// @namespace     AukroAlarm
// @version       1.0.0.0
// @namespace     https://github.com/micovo/aukroalarmscript/       
// @author        Mica
// @description   Alarm script for Aukro.cz  
// @downloadURL   https://raw.githubusercontent.com/micovo/aukroalarmscript/master/aukroalarm.user.js
// @updateURL     https://raw.githubusercontent.com/micovo/aukroalarmscript/master/aukroalarm.user.js
// @include       http://aukro.cz/*
// @require       http://code.jquery.com/jquery-latest.min.js
// @run-at        document-end
// ==/UserScript==

//////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////

//Timers setup
AlarmTime = 5*1000; //miliseconds
RefreshTime = 60*1000; //miliseconds

//Alarm setup
secondsToEndAlarm = 3*60; //seconds

//Link on the alarm sample
mAlarmSound = new Audio("https://www.dropbox.com/s/opz32tj8hzzxqi1/smokealarm.mp3?dl=1");
 
//////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////


//Global variables
var sledovano = 0;
var auctionId = "1234512345"; //TODO get auction ID from page URL
var secondsToEnd = -1;


//////////////////////////////////////////////////////////////////////
//
//  Main
//
//////////////////////////////////////////////////////////////////////

$(document).ready(function() 
{  
    var timeStr = $("li.timeInfo strong").text();
    
    secondsToEnd = parseInt(timeStr);
    
    if (timeStr.indexOf("Méně než minuta") > -1)
    {
        secondsToEnd = 1;
    }
    else if (timeStr.indexOf("minut") > -1)
    {
        secondsToEnd = secondsToEnd * 60;
    }
    else if (timeStr.indexOf("hodin") > -1)
    {
        secondsToEnd = secondsToEnd * 60 * 60;
    }
    else if ((timeStr.indexOf("den") > -1) || (timeStr.indexOf("dn") > -1))
    {
        secondsToEnd = secondsToEnd * 24 * 60 * 60; 
    }
    else
    {
        secondsToEnd = 0;
    }
    
    if (secondsToEnd < 24*60*60)
    {
        secondsToEnd = UpdateSecondsToEnd();
    }
    

    sledovano = getGMCookie(auctionId, 0);
    
    if (sledovano == 1)
    {
        $('div#siBidForm2').append('<div id="micaContainer" style="padding:20px;"><button id="micaButton">Zrušit sledování</button>&nbsp;&nbsp;&nbsp;Do konce: <span id="secondsToEnd">'+secondsToEnd+'</span> s, Alarm: '+secondsToEndAlarm+' s </div>');
    }
    else
    {
        $('div#siBidForm2').append('<div id="micaContainer" style="padding:20px;"><button id="micaButton">Sledovat skriptem</button>&nbsp;&nbsp;&nbsp;Do konce: <span id="secondsToEnd">'+secondsToEnd+'</span> s</div>');
    }
    
    
   
    
    SecondTickTimer();
});




//////////////////////////////////////////////////////////////////////
//
//  Events
//
//////////////////////////////////////////////////////////////////////

$(document).on( "click", "button#micaButton", function()
{
    
    if (sledovano == 1)
    {
        setGMCookie(auctionId, 0);
    }
    else
    {
        setGMCookie(auctionId, 1);
        
    }
    
    location.reload();
});

//////////////////////////////////////////////////////////////////////
//
//  Timers
//
//////////////////////////////////////////////////////////////////////


function AlarmTimer()
{
    mAlarmSound.play();  
    window.setTimeout(AlarmTimer, AlarmTime);
}


function RefreshTimer()
{
    location.reload();
    window.setTimeout(RefreshTimer, RefreshTime);
}

function SecondTickTimer()
{
    secondsToEnd = UpdateSecondsToEnd();
    $("span#secondsToEnd").text(secondsToEnd);
    
    if (sledovano == 1)
    {
        if (secondsToEnd > 0)
        {
            if (secondsToEnd <= secondsToEndAlarm)
            {
                AlarmTimer();
            }
        }
    }
    
    window.setTimeout(SecondTickTimer, 1000);
}


//////////////////////////////////////////////////////////////////////
//
//  Functions
//
//////////////////////////////////////////////////////////////////////

function UpdateSecondsToEnd()
{
    timeStr = $("li.timeInfo").text().split(",")[2];
    timeStr = timeStr.substring(1, 9);
    var endDate = parseTime(timeStr);
    var nowDate = new Date();

    if (nowDate > endDate)
    {
        endDate = endDate.setDate(endDate.getDate()+1);   
    }

    return Math.round((endDate - nowDate)/1000);
}

//////////////////////////////////////////////////////////////////////
//                                  
//  Helpers
//
//////////////////////////////////////////////////////////////////////


function parseTime(timeStr, dt) {
    if (!dt) {
        dt = new Date();
    }
 
    var time = timeStr.split(":");
 
    dt.setHours(parseInt(time[0]));
    dt.setMinutes(parseInt(time[1]));
    dt.setSeconds(parseInt(time[2]));
    return dt;
}

function setGMCookie(key, value){
	GM_setValue(key, value);
}

function getGMCookie(key, defaultValue)
{
	var gotValue;
	gotValue = GM_getValue(key, null);
	if(gotValue == null){
		setGMCookie(key, defaultValue);
		gotValue = defaultValue;
	}
	return gotValue;
}
