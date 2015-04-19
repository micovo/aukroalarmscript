// ==UserScript==
// @name       AukroAlarm
// @namespace  AukroAlarm
// @version    0.0.0.2
// @namespace      
// @author     Mica
// @description   https://github.com/micovo/aukroalarmscript/   
// @downloadURL   https://raw.githubusercontent.com/micovo/aukroalarmscript/master/aukroalarmscript.js
// @updateURL     https://raw.githubusercontent.com/micovo/aukroalarmscript/master/aukroalarmscript.js
// @include       http://aukro.cz/*
// @require       http://code.jquery.com/jquery-latest.min.js
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


var sledovano = 0;
var auctionId = "1234512345"; //TODO get auction ID from page URL
var secondsToEnd = -1;


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
    

    
    
    
    sledovano = getGMCookie(auctionId, 0);
    
    if (sledovano == 1)
    {
        $('div#siBidForm2').append('<div id="micaContainer" style="padding:20px;"><button id="micaButton">Zrušit sledování</button>&nbsp;&nbsp;&nbsp;Do konce: '+secondsToEnd+' s, Alarm: '+secondsToEndAlarm+' s </div>');
        window.setTimeout(RefreshTimer, RefreshTime);

        if (secondsToEnd > 0)
        {
            if (secondsToEnd <= secondsToEndAlarm)
            {
                AlarmTimer();
            }
        }
    }
    else
    {
        $('div#siBidForm2').append('<div id="micaContainer" style="padding:20px;"><button id="micaButton">Sledovat skriptem</button>&nbsp;&nbsp;&nbsp;Do konce: '+secondsToEnd+' s</div>');
    }
});





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
