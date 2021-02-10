 var svbt=document.getElementById('save');
 var spd=document.getElementById('mxsp');
 var stp=document.getElementById('mxst');
 var mbMd = document.getElementById('mobe');
 
var saver =function(){
	 	 spd.value=(spd.value>=1 && spd.value<=16)?spd.value:2.2;
	 stp.value=(stp.value>=0.01 && stp.value<=15)?stp.value:0.1;
		chrome.storage.sync.set(
		{
			defSpd: spd.value,
			defStp: stp.value,
			mob: mbMd.checked
		}, function()
		{
			let status = document.getElementById('stats');
			status.innerText = 'Options saved.';
			setTimeout(function()
			{
				status.innerText = '';
			}, 1250);
		});
	 }
 
function restore_options()
{
	if(typeof chrome.storage==='undefined'){
		restore_options();
	}else{
	chrome.storage.sync.get(null, function(items)
	{
		if (Object.keys(items).length !== 0)
		{
			//console.log(items);
			spd.value = items.defSpd;
			stp.value = items.defStp;
			mbMd.checked = items.mob;
			svbt.onclick = () => saver();
		}
		else
		{

			save_options();
			restore_options();
		}
	});
	}
}

function save_options()
{
	chrome.storage.sync.set(
	{
		defSpd: 2.2,
		defStp: 0.1,
		mob: false,
	}, function(){});

}

restore_options();