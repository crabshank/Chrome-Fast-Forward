function start(){
 var svbt=document.getElementById('save');
 var spd=document.getElementById('mxsp');
 var stp=document.getElementById('mxst');
 var status = document.getElementById('status');
 svbt.onclick=function(){
 saver();
 }
function saver(){
	 spd.value=(spd.value>=1 && spd.value<=16)?spd.value:6;
	 stp.value=(stp.value>=0.01 && stp.value<=15)?stp.value:0.5;
		chrome.storage.sync.set(
		{
			defSpd: spd.value,
			defStp: stp.value
		}, function()
		{
			status.textContent = 'Options saved.';
			setTimeout(function()
			{
				status.textContent = '';
			}, 1250);
		});
		}
}
start();