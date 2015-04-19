// ==UserScript==
// @name       AukroAlarm
// @namespace  AukroAlarm
// @version    0.0.0.1
// @namespace      
// @author     Mica
// @description   https://github.com/micovo/aukroalarmscript/   
// @include    http://aukro.cz/*
// @require    http://code.jquery.com/jquery-latest.min.js
// ==/UserScript==

//////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////

//Nastavení refreshování
AlarmTime = 5*1000; //milisekundy
RefreshTime = 60*1000; //milisekundy

//Nastavení alarmu
sekundDoKonceAlarm = 3*60; //sekundy

//Link na sample alarmu
mAlarmSound = new Audio("https://www.dropbox.com/s/opz32tj8hzzxqi1/smokealarm.mp3?dl=1");
 
//////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////


var sledovano = 0;
var aukce = "sem-linej-tohle-implementovat";
var sekundDoKonce = -1;


$(document).ready(function() 
{  
    
    
    var sekundDoKonce = 0;
    
    var timeStr = $("li.timeInfo strong").text();
    
    sekundDoKonce = parseInt(timeStr);
    
    if (timeStr.indexOf("Méně než minuta") > -1)
    {
        sekundDoKonce = 1;
    }
    else if (timeStr.indexOf("minut") > -1)
    {
        sekundDoKonce = sekundDoKonce * 60;
    }
    else if (timeStr.indexOf("hodin") > -1)
    {
        sekundDoKonce = sekundDoKonce * 60 * 60;
    }
    else if ((timeStr.indexOf("den") > -1) || (timeStr.indexOf("dn") > -1))
    {
        sekundDoKonce = sekundDoKonce * 24 * 60 * 60; 
    }
    else
    {
        sekundDoKonce = 0;
    }
    

    
    
    
    sledovano = getGMCookie(aukce, 0);
    
    if (sledovano == 1)
    {
        $('div#siBidForm2').append('<div id="micaContainer" style="padding:20px;"><button id="micaButton">Zrušit sledování</button>&nbsp;&nbsp;&nbsp;Do konce: '+sekundDoKonce+' s, Alarm: '+sekundDoKonceAlarm+' s </div>');
        window.setTimeout(RefreshTimer, RefreshTime);

        if (sekundDoKonce > 0)
        {
            if (sekundDoKonce <= sekundDoKonceAlarm)
            {
                AlarmTimer();
            }
        }
    }
    else
    {
        $('div#siBidForm2').append('<div id="micaContainer" style="padding:20px;"><button id="micaButton">Sledovat skriptem</button>&nbsp;&nbsp;&nbsp;Do konce: '+sekundDoKonce+' s</div>');
    }
});





$(document).on( "click", "button#micaButton", function()
{
    
    if (sledovano == 1)
    {
        setGMCookie(aukce, 0);
    }
    else
    {
        setGMCookie(aukce, 1);
        
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
