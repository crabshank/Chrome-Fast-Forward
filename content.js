var global={instances:[]};

var bdkCol="buttonface";
var txCol="black";
var bdkCol2="#f0f0f080";
var dfSpd=2.2;
var dfStp=0.1;
var mbMde=false;
var mbMdeFs=false;
var sks=10;
var blacklist='';

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

function findIndexTotalInsens(string, substring, index) {
    string = string.toLocaleLowerCase();
    substring = substring.toLocaleLowerCase();
    for (let i = 0; i < string.length ; i++) {
        if ((string.includes(substring, i)) && (!(string.includes(substring, i + 1)))) {
            index.push(i);
            break;
        }
    }
    return index;
}

function blacklistMatch(array, t) {
    var found = false;
	var blSite='';
    if (!((array.length == 1 && array[0] == "") || (array.length == 0))) {
        ts = t.toLocaleLowerCase();
        for (var i = 0; i < array.length; i++) {
            let spl = array[i].split('*');
            spl = removeEls("", spl);

            var spl_mt = [];
            for (let k = 0; k < spl.length; k++) {
                var spl_m = [];
                findIndexTotalInsens(ts, spl[k], spl_m);

                spl_mt.push(spl_m);


            }

            found = true;

            if ((spl_mt.length == 1) && (typeof spl_mt[0][0] === "undefined")) {
                found = false;
            } else if (!((spl_mt.length == 1) && (typeof spl_mt[0][0] !== "undefined"))) {

                for (let m = 0; m < spl_mt.length - 1; m++) {

                    if ((typeof spl_mt[m][0] === "undefined") || (typeof spl_mt[m + 1][0] === "undefined")) {
                        found = false;
                        m = spl_mt.length - 2; //EARLY TERMINATE
                    } else if (!(spl_mt[m + 1][0] > spl_mt[m][0])) {
                        found = false;
                    }
                }

            }
            blSite = (found) ? array[i] : blSite;
            i = (found) ? array.length - 1 : i;
        }
    }
    //console.log(found);
    return [found,blSite];

}

var isCurrentSiteBlacklisted = function()
{
		return blacklistMatch(blacklist, window.location.href);
};

var sDivsCSS="max-width: max-content !important; line-height: 0px !important; padding: 0px !important; display: flex !important; visibility: initial !important; z-index: "+Number.MAX_SAFE_INTEGER+" !important; position: absolute !important; background-color: transparent !important; flex-direction: row !important;";

	function bf_s_hmmss(s)
	{

		var ss = "00";
		var mm = "00";
		var hh = "";

		var hours = Math.max(0,Math.floor(Math.ceil(s) / 3600));
		if (hours > 0)
		{
			hh = hours + ":";
		}

		var mins = Math.max(0,Math.floor((Math.ceil(s) - hours * 3600) / 60));

		if (hours > 0 && mins<10)
		{
			mm = "0" + mins;
		}
		else
		{
			mm = mins;
		}
		var secs = Math.max(0,Math.floor(s - hours * 3600 - mins * 60));

		if (secs < 10)
		{
			ss = "0" + secs;
		}
		else
		{
			ss = secs;
		}

		return hh + mm + ":" + ss;
	}

function getAncestors(el){
	firstParent=el;
	let ancestors=[el];
	while(!!firstParent && typeof firstParent !=='undefined' && !!firstParent.parentElement && typeof firstParent.parentElement!=='undefined' && firstParent.parentElement.tagName!='BODY' && firstParent.parentElement.tagName!='HEAD' && firstParent.parentElement.tagName!='HTML'){
		firstParent=firstParent.parentElement;
		ancestors.push(firstParent);
	}
	return ancestors;
}

function findInst(v){
	for(let i=0; i<global.instances.length; i++){
		if (global.instances[i].video===v){
			return global.instances[i];
		}
	}
	return null;
}

function positionBar(i,scrl){
if(scrl){
i.sdivs.style.cssText=sDivsCSS+'opacity: 0 !important;';
}

let vrct=i.video.getBoundingClientRect();
let sdrct=i.sdivs.getBoundingClientRect();

let lf=vrct.left+0.001*vrct.width;

i.rightest=(lf>i.rightest || scrl)?lf:i.rightest;

if(i.video.tagName==='AUDIO'){
	if(vrct.top<sdrct.height){
		i.sDivsCSS2='top: '+vrct.bottom+'px !important;  left: '+i.rightest+'px !important;';
	}else{
		i.sDivsCSS2='top: '+(vrct.top-sdrct.height)+'px !important;  left: '+i.rightest+'px !important;';
	}
}else{
let tp=vrct.top-sdrct.top+0.102*vrct.height;
i.lowest=(tp>i.lowest || scrl)?tp:i.lowest;
i.sDivsCSS2='top: '+i.lowest+'px !important;  left: '+i.rightest+'px !important;';
}

i.sdivs.style.cssText=(scrl)?sDivsCSS+i.sDivsCSS2+'opacity: 0 !important;':sDivsCSS+i.sDivsCSS2;

}
	
function def_retCSS(i,bool){

positionBar(i,bool);

bdkCol=(i.butn.getAttribute("grn_synced")=="true")?"#007500":"buttonface";
txCol=(i.butn.getAttribute("grn_synced")=="true")?"white":"black";
bdkCol2=(i.butn.getAttribute("grn_synced")=="true")?"#00750080":"#f0f0f080";

bdkCol_1="buttonface";
txCol_1="black";
bdkCol2_1="#f0f0f080";

let bfStyle="min-width: 42px !important; line-height: 1.91ch !important; transform: translate(0, 0.06ch) !important; padding: 0 0.25ch 0 0 !important; display: initial !important; visibility:initial !important;  webkit-text-fill-color: black !important; border-width: 2px !important; border-style: outset !important; background-color: "+bdkCol_1+" !important; border-color: "+bdkCol_1+" !important; text-align-last: center !important; color: "+txCol_1+" !important;";
i.skb.style.cssText=bfStyle;
i.skf.style.cssText=bfStyle;
i.butn.style.cssText = "min-width: 75px !important; line-height: 1.91ch !important; transform: translate(0, 0.06ch) !important; padding: 0 0.25ch 0 0 !important; display: initial !important; visibility:initial !important;  webkit-text-fill-color: black !important; border-width: 2px !important; border-style: outset !important; background-color: "+bdkCol+" !important; border-color: "+bdkCol+" !important; text-align-last: right !important; color: "+txCol+" !important;";
i.clse.style.cssText = "max-width: max-content !important; min-width: 75px !important; line-height: 2ch !important; padding: 2px 0 2px 4px !important; display: initial !important; visibility: initial !important; background-color: #f00000 !important; webkit-text-fill-color: #ececec !important;  border-width: 0px !important; border-style: outset !important; border-color: #f00000 !important; color: white !important;";
clearTimeout(i.timer2);
i.timer2 = setTimeout(function(){
	if(!i.entered){
		if(mbMde || (mbMdeFs && !(document.fullscreen || document.webkitIsFullScreen))){
			let bfStyle2="min-width: 42px  !important; line-height: 1.91ch !important; transform: translate(0, 0.06ch) !important; padding: 0 0.25ch 0 0 !important; display: initial !important; visibility:initial !important;  webkit-text-fill-color: black !important; border-width: 2px !important; border-style: outset !important; background-color: "+bdkCol2_1+" !important; border-color: #00000000 !important; text-align-last: center !important; color: "+txCol_1+" !important";
i.skb.style.cssText=bfStyle2;
i.skf.style.cssText=bfStyle2;
i.butn.style.cssText = "min-width: 75px  !important; line-height: 1.91ch !important; transform: translate(0, 0.06ch) !important; padding: 0 0.25ch 0 0 !important; display: initial !important; visibility:initial !important;  webkit-text-fill-color: black !important; border-width: 2px !important; border-style: outset !important; background-color: "+bdkCol2+" !important; border-color: #00000000 !important; text-align-last: right !important; color: "+txCol+" !important";
i.clse.style.cssText = "max-width: max-content !important; min-width: 75px !important; line-height: 2ch !important; padding: 2px 0 2px 4px !important; display: initial !important; visibility: initial !important; background-color: rgb(240 0 0 / 50%) !important; webkit-text-fill-color: #ececec !important; border-width: 0px !important; border-style: outset !important; border-color: rgb(0 0 0 / 0.04) !important; color: white !important";
		}else{
			i.sdivs.style.cssText = sDivsCSS+i.sDivsCSS2+" opacity: 0 !important";
		}
		
	}
}, 3000);

}

function chgFlgs(i,on){
			i.pg_e=(on)?1:0;
			i.wt_e=(on)?1:0;
			i.pl_e=(on)?1:0;
			i.skd_e=(on)?1:0;
		    i.rc_e=(on)?1:0;
			i.wh_e=(on)?1:0;
			i.ip_e=(on)?1:0;
			i.pg=(on)?1:0;
}
			

function eligVid(vid){
if((get_src(vid)!='') && (vid.readyState != 0)){
	return true;
}else{
	return false;
}
}

function get_src(vid){
	if (vid.src !== "") {
		return vid.src;
	} else if (vid.currentSrc !== "") {
		return vid.currentSrc;
	}else{
		return '';
	}
}

function checkInclude(arr,el){
	let inside=false;
	for (let i = arr.length-1; i >= 0; i--) {
		if(arr[i]===el){
			inside=true;
			break;
		}
	}
	return inside;
}

function removeEls(d, array) {
    var newArray = [];
    for (let i = 0; i < array.length; i++) {
        if (array[i] != d) {
            newArray.push(array[i]);
        }
    }
    return newArray;
}

function elRemover(el){
	if(typeof el!=='undefined' && !!el){
	if(typeof el.parentNode!=='undefined' && !!el.parentNode){
		el.parentNode.removeChild(el);
	}
	}
}


function calcSp(i,noAdj){
				var lddRaw;
				var rgs=[];
				var lastPart=false;
				let c_i=i.video.currentTime;
			for (let k=i.video.buffered.length-1; k>=0; k--){
			let t_i=i.video.buffered.end(k);
			let s_i=i.video.buffered.start(k);
			
				if(t_i==i.video.duration && c_i>=s_i){
					lastPart=true;
					break;
				}else if(c_i>=s_i && t_i>=c_i){
					rgs.push([s_i,t_i]);
				}
			}
			
			if(lastPart){
					i.ldd='END';
					if(!noAdj){
					let vN=(Number.isNaN(i.clse.valueAsNumber))?1:i.clse.valueAsNumber;
						i.video.playbackRate=vN;		
					}
						i.butn.innerText=i.video.playbackRate.toLocaleString('en-GB', {minimumFractionDigits: 0, maximumFractionDigits: 7})+"x  [Buffered: "+i.ldd+"]";
					
			}else{
					var tot=0;
					if(rgs.length>0){
						
					let sorted=rgs.sort((a, b) => {return a[0] - b[0];})
					tot=sorted[0][1]-c_i;
					
					for (let k=1; k<sorted.length; k++){
						if(sorted[k-1][1]==sorted[k][0]){
							tot+=sorted[k][1]-sorted[k][0];
						}else{
							break;
						}
					}
					
					}
		
					
					if(!noAdj){
						lddRaw=(i.video.playbackRate==0)?tot:tot/i.video.playbackRate;
						let prev_mx=(i.lddArr.length==0)?lddRaw:Math.max(...i.lddArr);
						i.lddArr.push(lddRaw);
						let vN=(Number.isNaN(i.clse.valueAsNumber))?1:i.clse.valueAsNumber;
						let outSp=vN;
						if(lddRaw<=1){
						 outSp=Math.min(vN,Math.max(Math.floor(100*tot)*0.01,1));
						}else if(lddRaw>prev_mx){
							i.lddArr=[];
						}else{
								//let mx=Math.max(...i.lddArr);
								let mn=Math.min(...i.lddArr);
								let rng=prev_mx-mn;
								let rng_norm=(prev_mx==0)?1:rng/prev_mx;
								let outSp=Math.min(Math.floor(100*((1-rng_norm)*vN+rng_norm))*0.01,Math.min(vN,Math.max(Math.floor(100*tot)*0.01,1)));
					}
						if(outSp==i.video.playbackRate){
							lddRaw=(i.video.playbackRate==0)?tot:tot/i.video.playbackRate;
							i.ldd=bf_s_hmmss(lddRaw);
						i.butn.innerText=i.video.playbackRate.toLocaleString('en-GB', {minimumFractionDigits: 0, maximumFractionDigits: 7})+"x  [Buffered: "+i.ldd+"]";
						}else{
							lddRaw=tot/outSp;
							i.ldd=bf_s_hmmss(lddRaw);
							i.video.playbackRate=outSp;
							i.butn.innerText=i.video.playbackRate.toLocaleString('en-GB', {minimumFractionDigits: 0, maximumFractionDigits: 7})+"x  [Buffered: "+i.ldd+"]";
						}
					}else{
					lddRaw=(i.video.playbackRate==0)?tot:tot/i.video.playbackRate;
					i.ldd=bf_s_hmmss(lddRaw);
						i.butn.innerText=i.video.playbackRate.toLocaleString('en-GB', {minimumFractionDigits: 0, maximumFractionDigits: 7})+"x  [Buffered: "+i.ldd+"]";
					}

			}

							
					

}


function progress_hdl(event) {
let i=findInst(event.target);
if(!!i){
if(i.pg_e==1){
if(i.video.readyState>2){
i.pg=1;
calcSp(i,false);
}else{
i.video.playbackRate=1;
}
}else{
	calcSp(i,true);
}
}
}

function play_hdl(event) {
let i=findInst(event.target);
if(!!i){
def_retCSS(i,false);
if(i.pl_e==1){
if(i.video.readyState>2){
calcSp(i,false);
}else{
i.video.playbackRate=1;
}
}else{
	calcSp(i,true);
}
}
}

function waiting_hdl(event) {
let i=findInst(event.target);
if(!!i){
if(i.wt_e==1){
i.video.playbackRate=1;
def_retCSS(i,false);
}
}
}

function pointerenter_hdl(i) {
i.entered=true;
def_retCSS(i,false);
}

function pointermove_hdl(event) {
let i=findInst(event.target);
if(!!i){
def_retCSS(i,false);
}
}

function pointerleave_hdl(i) {
i.entered=false;
def_retCSS(i,false);
}

function fsc_hdl(i) {
let fsOn=document.fullscreen || document.webkitIsFullScreen;
if(fsOn){
	i.video.insertAdjacentElement('beforebegin',i.sdivs);
}else{
let anc=getAncestors(i.video);
let fpt=anc[anc.length-1];
fpt.insertAdjacentElement('beforebegin', i.sdivs);
}
def_retCSS(i,true);
}

function seeked_hdl(event) {
let i=findInst(event.target);
if(!!i){
i.cmu_sk=0;
i.skb.innerHTML='-'+sks.toLocaleString('en-GB', {minimumFractionDigits: 0, maximumFractionDigits: 7, useGrouping: false})+'s'; 	
i.skf.innerHTML='+'+sks.toLocaleString('en-GB', {minimumFractionDigits: 0, maximumFractionDigits: 7, useGrouping: false})+'s'; 
i.entered=false;
def_retCSS(i,false);
if(i.skd_e==1){
if(i.video.readyState>2){
calcSp(i,false);
}else{
i.video.playbackRate=1;
}
}else{
	calcSp(i,true);
}
}
}

function seeking_hdl(event) {
let i=findInst(event.target);
if(!!i){
i.entered=true;
def_retCSS(i,false);
/*if(i.skd_e==1){
i.butn.innerText=i.video.playbackRate.toLocaleString('en-GB', {minimumFractionDigits: 0, maximumFractionDigits: 7})+"x";
}*/
}
}

function ratechange_hdl(event) {
let i=findInst(event.target);
if(!!i){
if(i.rc_e==1){
let vN=(Number.isNaN(i.clse.valueAsNumber))?1:i.clse.valueAsNumber;
i.butn.innerText=i.video.playbackRate.toLocaleString('en-GB', {minimumFractionDigits: 0, maximumFractionDigits: 7})+"x";
if(i.video.readyState>2){
	calcSp(i,false);
}
}else{
	calcSp(i,true);
	i.butn.innerText=i.video.playbackRate.toLocaleString('en-GB', {minimumFractionDigits: 0, maximumFractionDigits: 7})+"x";
}
}
}

function cl_inp(i) {
//event.preventDefault();
event.stopPropagation();
def_retCSS(i,false);
if(i.ip_e==1){
let vN=(Number.isNaN(i.clse.valueAsNumber))?1:i.clse.valueAsNumber;
dfSpd=Math.min(16,Math.max(1,vN));
i.video.playbackRate=dfSpd;
i.lddArr=[];
	calcSp(i,false);
}else{
	calcSp(i,true);
}
}


function cl_whl(evt,i) {
	evt.preventDefault();
	evt.stopPropagation();
	def_retCSS(i,false);
		if(evt.deltaY>0){
		let vN=(Number.isNaN(i.clse.valueAsNumber))?1:i.clse.valueAsNumber;
		dfSpd=Math.max(1,vN-parseFloat(i.clse.step));
		i.clse.value=dfSpd.toLocaleString('en-GB', {minimumFractionDigits: 0, maximumFractionDigits: 7, useGrouping:false});
		i.lddArr=[];
		if(i.wh_e==1){
		i.video.playbackRate=dfSpd;
		}
		}
		if (evt.deltaY<0){
		let vN=(Number.isNaN(i.clse.valueAsNumber))?1:i.clse.valueAsNumber;
		dfSpd=Math.min(16,vN+parseFloat(i.clse.step));
		i.clse.value=dfSpd.toLocaleString('en-GB', {minimumFractionDigits: 0, maximumFractionDigits: 7, useGrouping:false});
		i.lddArr=[];
		if(i.wh_e==1){
		i.video.playbackRate=dfSpd;
		}
		}
	if(i.wh_e==1){
		cl_inp(i);
	}

}

function cl_clk(i) {
//event.preventDefault();
event.stopPropagation();
if(event.target!==i.skb && event.target!==i.skf &&event.target!==i.clse && event.target!==i.butn && event.target!==i.sdivs){
	let rectC=i.clse.getBoundingClientRect();
	let rectB=i.butn.getBoundingClientRect();
	let rectK=i.skb.getBoundingClientRect();
	let rectF=i.skf.getBoundingClientRect();
	if(event.pageX >= rectC.left && event.pageX <= rectC.right && event.pageY >= rectC.top && event.pageY <= rectC.bottom){
		i.clse.focus();
	}else if(event.pageX >= rectB.left && event.pageX <= rectB.right && event.pageY >= rectB.top && event.pageY <= rectB.bottom){
		i.butn.click();
	}else if(event.pageX >= rectK.left && event.pageX <= rectK.right && event.pageY >= rectK.top && event.pageY <= rectK.bottom){
		i.skb.click();
	}else if(event.pageX >= rectF.left && event.pageX <= rectF.right && event.pageY >= rectF.top && event.pageY <= rectF.bottom){
		i.skf.click();
	}
	i.ignClk=true;
}else if(i.ignClk){
	i.ignClk=false;
}
def_retCSS(i,false);
}

function cl_focus(i){
	event.preventDefault();
	event.stopPropagation();	
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
			

		if(!!items.defSpd && typeof  items.defSpd!=='undefined'){
			dfSpd=parseFloat(items.defSpd);
		}
			

		if(!!items.defStp && typeof  items.defStp!=='undefined'){
			dfStp=parseFloat(items.defStp);
		}
			
			if(items.mbIdx==0 || typeof items.mbIdx ==='undefined'){
				mbMde=false;
				mbMdeFs=false;
			}else if(items.mbIdx==1){
				mbMde=true;
				mbMdeFs=true;
			}else if(items.mbIdx==2){
				mbMde=false;
				mbMdeFs=true;
			}

		if(!!items.skamnt && typeof  items.skamnt!=='undefined'){
			sks=parseFloat(items.skamnt);
		}
		
		if(!!items.bList && typeof  items.bList!=='undefined'){
			blacklist=items.bList.split('\n').join('').split(',');
		}
		
		var isBl=isCurrentSiteBlacklisted();
			if(!isBl[0]){
			checker();
			
		if(typeof observer ==="undefined" && typeof timer ==="undefined"){
			var timer;
		const observer = new MutationObserver((mutations) =>
		{
			if (timer)
			{
				clearTimeout(timer);
			}
			timer = setTimeout(() =>
			{
				checker();
			}, 150);
		});


		observer.observe(document,
		{
			attributes: true,
			childList: true,
			subtree: true
		});
	}

			}else{
				console.warn('Current site is blacklisted from speed controller ("'+isBl[1]+'")' );
			}
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
		chrome.storage.sync.clear(function() {
	chrome.storage.sync.set(
	{
		defSpd: "2.2",
		defStp: "0.1",
		mbIdx: 0,
		skamnt: "10",
		bList: ""
	}, function()
	{
		console.log('Default options saved.');
		restore_options();
	});
		});

}

function creator(vid){

var obj={};

obj.video=vid;
obj.ff=-1;
let skb = document.createElement("button");
let skf = document.createElement("button");
let butn = document.createElement("button");
let sdivs = document.createElement("div");
let clse = document.createElement("input");
clse.type = "number";
butn.setAttribute("grn_synced", false);	
skb.innerHTML='-'+sks.toLocaleString('en-GB', {minimumFractionDigits: 0, maximumFractionDigits: 7, useGrouping: false})+'s'; 	
skf.innerHTML='+'+sks.toLocaleString('en-GB', {minimumFractionDigits: 0, maximumFractionDigits: 7, useGrouping: false})+'s'; 	
butn.innerText = vid.playbackRate.toLocaleString('en-GB', {minimumFractionDigits: 0, maximumFractionDigits: 7})+"x";

//obj.ances=fpt;

clse.value =dfSpd;
clse.min=1;
clse.max=16;
clse.step=dfStp;

clse.title="Maximum speed when fast forwarding; scroll to change.";

sdivs.appendChild(skb);
sdivs.appendChild(skf);
sdivs.appendChild(butn);
sdivs.appendChild(clse);

let anc=getAncestors(vid);
let fpt=anc[anc.length-1];

fpt.insertAdjacentElement('beforebegin', sdivs);

obj.skb=skb;
obj.skf=skf;
obj.butn=butn;
obj.clse=clse;
obj.sdivs=sdivs;
obj.cmu_sk=0;
butn.setAttribute('lddAhd',0);

obj.pg_e=0;
obj.wt_e=0;
obj.pl_e=0;
obj.skd_e=0;
obj.rc_e=0;
obj.wh_e=0;
obj.ip_e=0;
obj.ldd='';
obj.lddArr=[];
obj.pg_e=0;
obj.wh_e=0;
obj.pg=0;
//obj.clk_e=0;
obj.timer2;
obj.entered=false;
obj.lowest=0;
obj.rightest=0;
obj.sDivsCSS2="";
obj.sclr=false;
obj.ignClk=false;
global.instances.push(obj);

def_retCSS(obj, false);

document.addEventListener("scroll", (event) => {
	if(!obj.sclr){
		obj.sclr=true;
		def_retCSS(obj,true);
		obj.sclr=false;
	}
}, true);
document.addEventListener("scroll", (event) => {
	if(!obj.sclr){
		obj.sclr=true;
		def_retCSS(obj,true);
		obj.sclr=false;
	}
}, false);

skb.addEventListener("click", sk_bk(obj));	
skf.addEventListener("click", sk_fw(obj));	
butn.addEventListener("click", btclk(obj));	
sdivs.addEventListener('wheel',(evt) => cl_whl(evt,obj));
vid.addEventListener('ratechange',ratechange_hdl);

clse.addEventListener('keyup',() => cl_inp(obj));
clse.addEventListener('keydown',() => cl_inp(obj));
clse.addEventListener('change',() => cl_inp(obj));
clse.addEventListener('change',() => cl_inp(obj));
/*clse.addEventListener('click',() => cl_clk(obj));
sdivs.addEventListener('click',() => cl_clk(obj));
butn.addEventListener('click',() => cl_clk(obj));*/
clse.addEventListener('focus',() => cl_focus(obj));
/*clse.addEventListener('pointerdown',() => cl_clk(obj));
sdivs.addEventListener('pointerdown',() => cl_clk(obj));
butn.addEventListener('pointerdown',() => cl_clk(obj));*/
sdivs.addEventListener('pointerenter',() => pointerenter_hdl(obj));
sdivs.addEventListener('pointerleave',() => pointerleave_hdl(obj));
window.addEventListener('pointerdown',() => cl_clk(obj));
document.addEventListener('fullscreenchange',() => fsc_hdl(obj));
document.addEventListener('webkitfullscreenchange',() => fsc_hdl(obj));
vid.addEventListener('pointermove',pointermove_hdl);
vid.addEventListener('seeked',seeked_hdl);
vid.addEventListener('seeking',seeking_hdl);
vid.addEventListener('play',play_hdl);
vid.addEventListener('progress',progress_hdl);
vid.addEventListener('waiting',waiting_hdl);
}

function btclk(i) {
		return function() {
			event.preventDefault();
			event.stopPropagation();
			if(i.ff==-1){
			chgFlgs(i,true);
			i.butn.setAttribute("grn_synced", true);
			let vN=(Number.isNaN(i.clse.valueAsNumber))?1:i.clse.valueAsNumber;
			i.video.playbackRate=vN;
			i.butn.setAttribute("grn_synced", true);	
			i.ff=1;
			}else if (i.ff==0){
			chgFlgs(i,true);
			let vN=(Number.isNaN(i.clse.valueAsNumber))?1:i.clse.valueAsNumber;
			i.video.playbackRate=vN;
			i.butn.setAttribute("grn_synced", true);
			i.ff=1;
			}else{
			chgFlgs(i,false);
			i.video.playbackRate=1;
			i.butn.innerText="1x";
			i.butn.setAttribute("grn_synced", false);	
			i.ff=0;
			i.lddArr=[];
			}
			def_retCSS(i,false);
		};
}

function sk_bk(i){
			return function() {
	i.video.currentTime=Math.max(0,i.video.currentTime-sks);
	i.cmu_sk-=sks;
	if(i.cmu_sk<-1*sks){
		i.skf.innerHTML='+'+sks.toLocaleString('en-GB', {minimumFractionDigits: 0, maximumFractionDigits: 7, useGrouping: false})+'s'; 
	i.skb.innerHTML=i.cmu_sk.toLocaleString('en-GB', {minimumFractionDigits: 0, maximumFractionDigits: 7, useGrouping: false})+'s'; 
	}else if(i.cmu_sk>sks){
	i.skb.innerHTML='-'+sks.toLocaleString('en-GB', {minimumFractionDigits: 0, maximumFractionDigits: 7, useGrouping: false})+'s'; 
	i.skf.innerHTML='+'+i.cmu_sk.toLocaleString('en-GB', {minimumFractionDigits: 0, maximumFractionDigits: 7, useGrouping: false})+'s'; 
	}else{
		i.skb.innerHTML='-'+sks.toLocaleString('en-GB', {minimumFractionDigits: 0, maximumFractionDigits: 7, useGrouping: false})+'s'; 	
i.skf.innerHTML='+'+sks.toLocaleString('en-GB', {minimumFractionDigits: 0, maximumFractionDigits: 7, useGrouping: false})+'s'; 
}
			};
}
function sk_fw(i){
	return function() {
	if(isFinite(i.video.duration)){
		i.video.currentTime=Math.min(i.video.duration,i.video.currentTime+sks);
	}else{
		i.video.currentTime+=sks;
	}
	i.cmu_sk+=sks;
	if(i.cmu_sk>sks){
	i.skb.innerHTML='-'+sks.toLocaleString('en-GB', {minimumFractionDigits: 0, maximumFractionDigits: 7, useGrouping: false})+'s'; 
	i.skf.innerHTML='+'+i.cmu_sk.toLocaleString('en-GB', {minimumFractionDigits: 0, maximumFractionDigits: 7, useGrouping: false})+'s'; 
	}else if(i.cmu_sk<-1*sks){
		i.skf.innerHTML='+'+sks.toLocaleString('en-GB', {minimumFractionDigits: 0, maximumFractionDigits: 7, useGrouping: false})+'s'; 
	i.skb.innerHTML=i.cmu_sk.toLocaleString('en-GB', {minimumFractionDigits: 0, maximumFractionDigits: 7, useGrouping: false})+'s'; 
	}else{
		i.skb.innerHTML='-'+sks.toLocaleString('en-GB', {minimumFractionDigits: 0, maximumFractionDigits: 7, useGrouping: false})+'s'; 	
i.skf.innerHTML='+'+sks.toLocaleString('en-GB', {minimumFractionDigits: 0, maximumFractionDigits: 7, useGrouping: false})+'s'; 
}
	};
}

function checker(){
			let DOMvids=[
			...document.getElementsByTagName('video'),
			...document.getElementsByTagName('audio')
			];
			
			for (let j=0; j<DOMvids.length; j++){
				let found=false;
				
				for (let k=0; k<global.instances.length; k++){
					if(DOMvids[j]===global.instances[k].video){
						k=global.instances.length-1;
						found=true;
					}
				}
				
				if(!found){
					 if(eligVid(DOMvids[j])){
						 creator(DOMvids[j]);
					 }
				}
				
			}
			
			for(let n=0; n<global.instances.length; n++){
				let inst=global.instances[n];
				if(!checkInclude(DOMvids,inst.video) || !eligVid(inst.video)){
					try{
						i.video.removeEventListener('progress',progress_hdl);
						i.video.removeEventListener('play',play_hdl);
						i.video.removeEventListener('waiting',waiting_hdl);
						i.video.removeEventListener('pointermove',pointermove_hdl);
						i.video.removeEventListener('ratechange',ratechange_hdl);
						i.video.removeEventListener('seeked',seeked_hdl);
						i.video.removeEventListener('seeking',seeking_hdl);
					}
					catch(err){
						;
					}
					finally{
					elRemover(inst.butn);
					elRemover(inst.clse);
					elRemover(inst.skf);
					elRemover(inst.skb);
					elRemover(inst.sdivs);
					global.instances=removeEls(inst,global.instances);
					}
				}
			}
	}

restore_options();