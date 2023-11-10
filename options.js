  var bfd = document.getElementById('bffd');
 var svbt=document.getElementById('save');
 var spd=document.getElementById('mxsp');
 var stp=document.getElementById('mxst');
var visib=document.getElementById('vsb');
var seeka=document.getElementById('ska');
var seekp=document.getElementById('skp');
var scorpr=document.getElementById('sorp');
var c_clk=document.getElementById('cclk');
var sk_buff_cbx=document.getElementById('sk_buff');
var blklst=document.getElementById('blacklist');

var vfBar=document.getElementById('vfBar');
var fMtx=document.getElementById('fMtx');
fMtx.checked=true;

blklst.oninput=function () {
blklst.style.height = 'inherit';
blklst.style.height = (blklst.scrollHeight+7)+"px";
}

function removeEls(d, array){
	var newArray = [];
	for (let i = 0; i < array.length; i++)
	{
		if (array[i] != d)
		{
			newArray.push(array[i]);
		}
	}
	return newArray;
}

function unDef(v,d,r){
	if(typeof r==='undefined'){
		return (typeof v !=='undefined')?v:d;
	}else{
		return (typeof v !=='undefined')?r:d;
	}
}

var saver =function(){
	 	spd.value=(spd.valueAsNumber>=1 && spd.valueAsNumber<=16)?spd.value:"2.2";
		stp.value=(stp.valueAsNumber>=0.01 && stp.valueAsNumber<=15)?stp.value:"0.1";
		seeka.value=(seeka.valueAsNumber>=0)?seeka.value:"10";
		seekp.value=(seekp.valueAsNumber>=0)?seekp.value:"4";
		
	let lstChk = blklst.value.split(',');
	let validate = true;

	lstChk = removeEls("", lstChk);

	for (let i = 0; i < lstChk.length; i++)
	{

		if (lstChk[i].split('/').length == 1)
		{
			console.log(lstChk[i] + ' is valid!');
		}
		else
		{

			if (lstChk[i].split('://')[0] == "")
			{
				console.warn(lstChk[i] + ' is invalid');
				validate = false;
			}

			if (lstChk[i].split('://')[lstChk[i].split('://').length + 1] == "")
			{
				console.warn(lstChk[i] + ' is invalid');
				validate = false;
			}

			if (lstChk[i].split('://').join('').split('/').length !== removeEls("", lstChk[i].split('://').join('').split('/')).length)
			{
				console.warn(lstChk[i] + ' is invalid');
				validate = false;
			}

		}

	}

	if (validate)
	{

			chrome.storage.sync.clear(function() {
		chrome.storage.sync.set(
		{
			defSpd: spd.value,
			defStp: stp.value,
			mbIdx: visib.selectedIndex,
			skamnt: seeka.value,
			skamntpc: seekp.value,
			secprc: scorpr.selectedIndex,
			cvsClk: c_clk.selectedIndex,
			skbcbx: sk_buff_cbx.checked,
			vidFilts: vfBar.checked,
			custMtx: fMtx.checked,
			bList: blklst.value
		}, function()
		{
			let status = document.getElementById('stats');
			status.innerText = 'Options saved.';
			setTimeout(function()
			{
				status.innerText = '';
			}, 1250);
		});
			});
			
}else{
	alert('Blacklist textarea contents invalid!');
}
	 }
 
function restore_options()
{
	if(typeof chrome.storage==='undefined'){
		restore_options();
	}else{
	chrome.storage.sync.get(null, function(items)
	{
		if (Object.keys(items).length != 0)
		{
			//console.log(items);
			spd.value = unDef(items.defSpd,"2.2");
			stp.value = unDef(items.defStp,"0.1");
			visib.selectedIndex = unDef(items.mbIdx,0);
			seeka.value= unDef(items.skamnt,"10");
			seekp.value= unDef(items.skamntpc,"4");
			scorpr.selectedIndex = unDef(items.secprc,0);
			c_clk.selectedIndex = unDef(items.cvsClk,0);
			sk_buff_cbx.checked = unDef(items.skbcbx,false);
			vfBar.checked = unDef(items.vidFilts,false);
			fMtx.checked = unDef(items.custMtx,true);
			blklst.value= unDef(items.bList,"");
blklst.style.height = 'inherit';
blklst.style.height = (blklst.scrollHeight+7)+"px";
			svbt.onclick = () => saver();
		}
		else
		{
			save_options();
		}
	});
	}
}

function save_options()
{
		chrome.storage.sync.clear(function() {
	chrome.storage.sync.set(
	{
		defSpd: "2.2",
		defStp: "0.1",
		mbIdx: 0,
		skamnt: "10",
		skamntpc: "4",
		secprc: 0,
		cvsClk: 0,
		skbcbx: false,
		vidFilts: false,
		custMtx: true,
		bList: ""
	}, function(){
		restore_options();
	});
		});
}

restore_options();