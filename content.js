var global={instances:[], monitored:[]};

var bdkCol="buttonface";
var txCol="black";
var bdkCol2="#f0f0f080";
var dfSpd=2.2;
var dfStp=0.1;
var mbMde=false;
var mbMdeFs=false;
var sks=10;
var skp=4;
var blacklist='';
var sk_buff=false;
var prefPerc=false;

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

var sDivsCSS="max-width: max-content !important; line-height: 0px !important; padding: 0px !important; display: table !important; visibility: initial !important; float: initial !important; z-index: "+Number.MAX_SAFE_INTEGER+" !important; position: absolute !important; background-color: transparent !important;";

	function bf_s_hmmss(s, z)
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

		if ((hours > 0 && mins<10) || (z && mins<10))
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

function findInst(v, mon){
	if(!mon){
		let arrChk=global.instances.filter((i)=>{return i.video===v;});
		return (arrChk.length>0)?arrChk[0]:null;
	}else{
		let arrChk=global.monitored.filter((m)=>{return m===v;});
		return (arrChk.length>0)?arrChk[0]:null;
	}
}

function positionBar(i,scrl, showPrg){
if(scrl){
i.sdivs.style.cssText=sDivsCSS+'opacity: 0 !important;';
}

i.cvs.style.setProperty('display','none','important');

let vrct=i.video.getBoundingClientRect();
let sdrct=i.sdivs.getBoundingClientRect();

let lf=vrct.left+0.001*vrct.width;

i.rightest=(lf>i.rightest || scrl)?lf:i.rightest;

if(i.video.tagName==='AUDIO'){
	if(vrct.top<2*sdrct.height){
		i.sDivsCSS2='top: '+vrct.bottom+'px !important;  left: '+i.rightest+'px !important;';
	}else{
		i.sDivsCSS2='top: '+(vrct.top-2*sdrct.height)+'px !important;  left: '+i.rightest+'px !important;';
	}
}else{
let tp=vrct.top-sdrct.top+0.102*vrct.height;
i.lowest=(tp>i.lowest || scrl)?tp:i.lowest;
i.sDivsCSS2='top: '+i.lowest+'px !important;  left: '+i.rightest+'px !important;';
}

i.sdivs.style.cssText=(scrl)?sDivsCSS+i.sDivsCSS2+'opacity: 0 !important;':sDivsCSS+i.sDivsCSS2;
sdrct=i.sdivs.getBoundingClientRect();
i.cvs.style.setProperty('width',((sdrct.width>vrct.width)?sdrct.width:(vrct.right-sdrct.left))+'px','important');
i.cvs.style.setProperty('height',(sdrct.height)+'px','important');
i.cvs.style.setProperty('margin-top','1px','important');

if(scrl || !showPrg){
	 	i.cvs.style.setProperty('opacity',0,'important');
}else{
		i.cvs.style.setProperty('display','initial','important');
		 i.cvs.style.setProperty('opacity',0.64,'important');
}
}
	
function def_retCSS(i,bool, showPrg){

positionBar(i,bool, showPrg);

bdkCol=(i.butn.getAttribute("grn_synced")=="true")?"#007500":"buttonface";
txCol=(i.butn.getAttribute("grn_synced")=="true")?"white":"black";
bdkCol2=(i.butn.getAttribute("grn_synced")=="true")?"#00750080":"#f0f0f080";

bdkCol_1="buttonface";
txCol_1="black";
bdkCol2_1="#f0f0f080";

let bfStyle="min-width: 42px !important; line-height: 1.91ch !important; transform: translate(0, 0.06ch) !important; padding: 0 0.25ch 0 0 !important; visibility:initial !important;  webkit-text-fill-color: black !important; border-width: 2px !important; border-style: outset !important; background-color: "+bdkCol_1+" !important; border-color: "+bdkCol_1+" !important; float: initial !important; text-align-last: center !important; color: "+txCol_1+" !important;";

let ds_i=" display: initial !important;";
let ds_n=" display: none !important;";

i.skb.style.cssText=bfStyle+ds_i;
i.skf.style.cssText=bfStyle+ds_i;


if(!sk_buff){
	i.skb_l.style.cssText=bfStyle+ds_n;
	i.skf_l.style.cssText=bfStyle+ds_n;
}else{
	i.skb_l.style.cssText=bfStyle+ds_i;
	i.skf_l.style.cssText=bfStyle+ds_i;
}

i.butn.style.cssText = "min-width: 75px !important; line-height: 1.91ch !important; transform: translate(0, 0.06ch) !important; padding: 0 0.25ch 0 0 !important; display: initial !important; visibility:initial !important;  webkit-text-fill-color: black !important; border-width: 2px !important; border-style: outset !important; background-color: "+bdkCol+" !important; border-color: "+bdkCol+" !important; float: initial !important; text-align-last: right !important; color: "+txCol+" !important;";
i.clse.style.cssText = "max-width: max-content !important; min-width: 75px !important; line-height: 2ch !important; padding: 0.175ch 0 2px 4px !important; display: initial !important; visibility: initial !important; background-color: #f00000 !important; webkit-text-fill-color: #ececec !important;  border-width: 0px !important; border-style: outset !important; border-color: #f00000 !important; float: initial !important; color: white !important;";

clearTimeout(i.timer3);
i.timer3 = setTimeout(function(){
	if(!i.entered_cvs){
			i.cvs.style.setProperty('opacity',(i.entered ? 0.64 : 0),'important');
	}
},1250);
	
	clearTimeout(i.timer2);
i.timer2 = setTimeout(function(){
	if(!i.entered){
		if(mbMde || (mbMdeFs && !(document.fullscreen || document.webkitIsFullScreen))){
			let bfStyle2="min-width: 42px  !important; line-height: 1.91ch !important; transform: translate(0, 0.06ch) !important; padding: 0 0.25ch 0 0 !important; visibility:initial !important;  webkit-text-fill-color: black !important; border-width: 2px !important; border-style: outset !important; background-color: "+bdkCol2_1+" !important; border-color: #00000000 !important; float: initial !important; text-align-last: center !important; color: "+txCol_1+" !important";

i.skb.style.cssText=bfStyle2+ds_i;
i.skf.style.cssText=bfStyle2+ds_i;

if(!sk_buff){
	i.skb_l.style.cssText=bfStyle2+ds_n;
	i.skf_l.style.cssText=bfStyle2+ds_n;
}else{
	i.skb_l.style.cssText=bfStyle2+ds_i;
	i.skf_l.style.cssText=bfStyle2+ds_i;
}

i.butn.style.cssText = "min-width: 75px  !important; line-height: 1.91ch !important; transform: translate(0, 0.06ch) !important; padding: 0 0.25ch 0 0 !important; display: initial !important; visibility:initial !important;  webkit-text-fill-color: black !important; border-width: 2px !important; border-style: outset !important; background-color: "+bdkCol2+" !important; border-color: #00000000 !important; float: initial !important; text-align-last: right !important; color: "+txCol+" !important";
i.clse.style.cssText = "max-width: max-content !important; min-width: 75px !important; line-height: 2ch !important; padding: 0.175ch 0 2px 4px !important; display: initial !important; visibility: initial !important; background-color: rgb(240 0 0 / 50%) !important; webkit-text-fill-color: #ececec !important; border-width: 0px !important; border-style: outset !important; border-color: rgb(0 0 0 / 0.04) !important; float: initial !important; color: white !important";
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
	let arrChk=arr.filter((a)=>{return a===el});
	return (arrChk.length>0)?true:false;
}

function removeEls(d, array) {
    return array.filter((a)=>{return a!=d});
}

function elRemover(el){
	if(typeof el!=='undefined' && !!el){
	if(typeof el.parentNode!=='undefined' && !!el.parentNode){
		el.parentNode.removeChild(el);
	}
	}
}

function setPix(pixels, x, y, r, g, b, width) {
    var index = 4 * (x + y * width);
    pixels[index+0] = r;
    pixels[index+1] = g;
    pixels[index+2] = b;
    pixels[index+3] =255 ;
}

function drawBuffered(i){
	var len=i.video.buffered.length;
	if(len>0){
			var ctx = i.cvs.getContext('2d');
			ctx.globalCompositeOperation = "source-over";
			var canvasWidth = i.cvs.scrollWidth;
			var canvasHeight = i.cvs.scrollHeight;
			
			if(canvasWidth>0 && canvasHeight>0){
			
			i.cvs.width =canvasWidth;
			i.cvs.height =canvasHeight;
			var iData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
			var pixels = iData.data;
			
	if(isFinite(i.video.duration)){
		i.cvs.setAttribute('start', 0);
		i.cvs.setAttribute('end', i.video.duration);
			for (let k=len-1; k>=0; k--){
				let t_i=i.video.buffered.end(k);
				let s_i=i.video.buffered.start(k);
				let prp=canvasWidth/i.video.duration;
				let xds=Math.ceil(s_i*prp);
				let xdt=Math.floor(t_i*prp);
				let c_i=i.video.currentTime;
				let xdc=(c_i>=s_i && c_i<=t_i)?Math.ceil(c_i*prp):-1;
				for (let y=canvasHeight-1; y>=0; y--){
				for (let x=xds; x<=xdt; x++){
					if(xdc!=-1 && x>=xdc && x<=xdt){
						setPix(pixels, x, y, 0,171,14, canvasWidth);
					}else{
						setPix(pixels, x, y, 144,67,204, canvasWidth);
					}
				}
				}
			}	
			
					}else{
						
						let c_i=i.video.currentTime;
						let latest=Math.max(i.video.buffered.end(len-1), c_i);
						let earliest=Math.min(i.video.buffered.start(0), c_i);
						i.cvs.setAttribute('start', earliest);
						i.cvs.setAttribute('end', latest);
						ctx.clearRect(0, 0, canvasWidth, canvasHeight);
						for (let k=len-1; k>=0; k--){
							let t_i=i.video.buffered.end(k);
							let s_i=i.video.buffered.start(k);
							let prp=canvasWidth/(latest-earliest)
							let xds=Math.ceil((s_i-earliest)*prp);
							let xdt=Math.floor((t_i-earliest)*prp);
							let c_i=i.video.currentTime;
							let xdc=(c_i>=s_i && c_i<=t_i)?Math.ceil((c_i-earliest)*prp):-1;
							for (let y=canvasHeight-1; y>=0; y--){
							for (let x=xds; x<=xdt; x++){
								if(xdc!=-1 && x>=xdc && x<=xdt){
									setPix(pixels, x, y, 0,171,14, canvasWidth);
								}else{
									setPix(pixels, x, y, 144,67,204, canvasWidth);
								}
							}
						}	
					}
					}
					ctx.clearRect(0, 0, canvasWidth, canvasHeight);
					ctx.putImageData(iData, 0, 0);
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
		
					

						lddRaw=(i.video.playbackRate==0)?tot:tot/i.video.playbackRate;
					if(!noAdj && ( (!i.video.paused) ||  (i.video.paused && lddRaw<2))){
						let prev_mx=(i.lddArr.length==0)?lddRaw:Math.max(...i.lddArr);
						i.lddArr.push(lddRaw);
						let vN=(Number.isNaN(i.clse.valueAsNumber))?1:i.clse.valueAsNumber;
						let outSp=vN;
						if(lddRaw!=2){
							//50*tot=(1/2)*100*tot ; for >= 2 real secs loaded
							if(lddRaw<2){
							 outSp=Math.min(vN,Math.max(Math.floor(50*tot)*0.01,1));
							}else if(lddRaw>prev_mx){
								i.lddArr=[];
							}else{
									//let mx=Math.max(...i.lddArr);
									let mn=Math.min(...i.lddArr);
									let rng=prev_mx-mn;
									let rng_norm=(prev_mx==0)?1:Math.sqrt(rng/prev_mx);
									let outSp=Math.min(Math.floor(100*((1-rng_norm)*vN+rng_norm))*0.01,Math.min(vN,Math.max(Math.floor(50*tot)*0.01,1)));
						}
					}
						if(outSp==i.video.playbackRate){
							lddRaw=(i.video.playbackRate==0)?tot:tot/i.video.playbackRate;
							i.ldd=bf_s_hmmss(lddRaw, false);
						i.butn.innerText=i.video.playbackRate.toLocaleString('en-GB', {minimumFractionDigits: 0, maximumFractionDigits: 7})+"x  [Buffered: "+i.ldd+"]";
						}else{
							lddRaw=tot/outSp;
							i.ldd=bf_s_hmmss(lddRaw, false);
							i.video.playbackRate=outSp;
							i.butn.innerText=i.video.playbackRate.toLocaleString('en-GB', {minimumFractionDigits: 0, maximumFractionDigits: 7})+"x  [Buffered: "+i.ldd+"]";
						}
					}else{
					lddRaw=(i.video.playbackRate==0)?tot:tot/i.video.playbackRate;
					i.ldd=bf_s_hmmss(lddRaw, false);
						i.butn.innerText=i.video.playbackRate.toLocaleString('en-GB', {minimumFractionDigits: 0, maximumFractionDigits: 7})+"x  [Buffered: "+i.ldd+"]";
					}

			}

drawBuffered(i);
}

function progress_hdl(event) {
let i=findInst(event.target,false);
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

function progress_hdl_chk(event) {
let i=findInst(event.target,true);
if(!!i){
if(i.readyState>2){
checker();
}
}
}

function play_hdl(event) {
let i=findInst(event.target,false);
if(!!i){
def_retCSS(i,false,true);
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
let i=findInst(event.target,false);
if(!!i){
if(i.wt_e==1){
i.video.playbackRate=1;
def_retCSS(i,false,true);
}
}
}

function pointerenter_hdl(i) {
i.entered=true;
def_retCSS(i,false,true);
}

function pointermove_hdl(event) {
let i=findInst(event.target,false);
if(!!i){
def_retCSS(i,false,false);
}
}

function pointerleave_hdl(i) {
i.entered=false;
def_retCSS(i,false,true);
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
let i=findInst(event.target,false);
if(!!i){
i.cmu_sk=0;
i.skb.innerHTML=(prefPerc && isFinite(i.video.duration))?'-'+skp.toLocaleString('en-GB', {minimumFractionDigits: 0, maximumFractionDigits: 7, useGrouping: false})+'%':'-'+sks.toLocaleString('en-GB', {minimumFractionDigits: 0, maximumFractionDigits: 7, useGrouping: false})+'s'; 	
i.skf.innerHTML=(prefPerc && isFinite(i.video.duration))?'+'+skp.toLocaleString('en-GB', {minimumFractionDigits: 0, maximumFractionDigits: 7, useGrouping: false})+'%':'+'+sks.toLocaleString('en-GB', {minimumFractionDigits: 0, maximumFractionDigits: 7, useGrouping: false})+'s'; 	
i.entered=false;
def_retCSS(i,false,true);
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
let i=findInst(event.target,false);
if(!!i){
i.entered=true;
def_retCSS(i,false,true);
/*if(i.skd_e==1){
i.butn.innerText=i.video.playbackRate.toLocaleString('en-GB', {minimumFractionDigits: 0, maximumFractionDigits: 7})+"x";
}*/
}
}

function ratechange_hdl(event) {
let i=findInst(event.target,false);
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
def_retCSS(i,false,true);
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
	def_retCSS(i,false,true);
	if(evt.target !== i.cvs){
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
}

function cl_clk(i) {
//event.preventDefault();
event.stopPropagation();
if(event.target!==i.skb && event.target!==i.skf &&event.target!==i.clse && event.target!==i.butn && event.target!==i.sdivs){
	let rectC=i.clse.getBoundingClientRect();
	let rectB=i.butn.getBoundingClientRect();
	let rectK=i.skb.getBoundingClientRect();
	let rectF=i.skf.getBoundingClientRect();
	let rectV=i.cvs.getBoundingClientRect();

	if(event.pageX >= rectC.left && event.pageX <= rectC.right && event.pageY >= rectC.top && event.pageY <= rectC.bottom){
		i.clse.focus();
	}else if(event.pageX >= rectB.left && event.pageX <= rectB.right && event.pageY >= rectB.top && event.pageY <= rectB.bottom){
		i.butn.click();
	}else if(event.pageX >= rectK.left && event.pageX <= rectK.right && event.pageY >= rectK.top && event.pageY <= rectK.bottom){
		i.skb.click();
	}else if(event.pageX >= rectF.left && event.pageX <= rectF.right && event.pageY >= rectF.top && event.pageY <= rectF.bottom){
		i.skf.click();
	}else if(event.pageX >= rectV.left && event.pageX <= rectV.right && event.pageY >= rectV.top && event.pageY <= rectV.bottom){
		i.obscPrg={x: event.pageX, l: rectV.left, w:rectV.width}
		i.cvs.click();
	}else if(sk_buff){
		let rectKL=i.skb_l.getBoundingClientRect();
		let rectFL=i.skf_l.getBoundingClientRect();
		if(event.pageX >= rectKL.left && event.pageX <= rectKL.right && event.pageY >= rectKL.top && event.pageY <= rectKL.bottom){
			i.skb_l.click();
		}else if(event.pageX >= rectFL.left && event.pageX <= rectFL.right && event.pageY >= rectFL.top && event.pageY <= rectFL.bottom){
			i.skf_l.click();
		}
	}
	
	i.ignClk=true;
}else if(i.ignClk){
	i.ignClk=false;
}
def_retCSS(i,false,true);
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
			
			if(!(items.secprc==0 || typeof items.secprc ==='undefined')){
				prefPerc=true;
			}	

			if(!!items.skbcbx && typeof items.skbcbx !=='undefined'){
				sk_buff=items.skbcbx;
			}

		if(!!items.skamnt && typeof  items.skamnt!=='undefined'){
			sks=parseFloat(items.skamnt);
		}	
		
		if(!!items.skamntpc && typeof  items.skamntpc!=='undefined'){
			skp=parseFloat(items.skamntpc);
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
		skamntpc: "4",
		secprc: 0,
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
let skb_l = document.createElement("button");
let skf_l = document.createElement("button");
let cvs = document.createElement("canvas");

clse.type = "number";
butn.setAttribute("grn_synced", false);	
skb.innerHTML=(prefPerc && isFinite(vid.duration))?'-'+skp.toLocaleString('en-GB', {minimumFractionDigits: 0, maximumFractionDigits: 7, useGrouping: false})+'%':'-'+sks.toLocaleString('en-GB', {minimumFractionDigits: 0, maximumFractionDigits: 7, useGrouping: false})+'s'; 	
skf.innerHTML=(prefPerc && isFinite(vid.duration))?'+'+skp.toLocaleString('en-GB', {minimumFractionDigits: 0, maximumFractionDigits: 7, useGrouping: false})+'%':'+'+sks.toLocaleString('en-GB', {minimumFractionDigits: 0, maximumFractionDigits: 7, useGrouping: false})+'s'; 	
butn.innerText = vid.playbackRate.toLocaleString('en-GB', {minimumFractionDigits: 0, maximumFractionDigits: 7})+"x";
skb_l.innerHTML="↶";
skb_l.title="Skip to start of previous buffered range";
skf_l.innerHTML="↷";
skf_l.title="Skip to start of next buffered range";
//obj.ances=fpt;

clse.value =dfSpd.toLocaleString('en-GB', {minimumFractionDigits: 0, maximumFractionDigits: 7, useGrouping:false});
clse.min=1;
clse.max=16;
clse.step=dfStp;

clse.title="Maximum speed when fast forwarding; scroll to change.";

sdivs.appendChild(skb);
sdivs.appendChild(skf);
sdivs.appendChild(butn);
sdivs.appendChild(clse);
sdivs.appendChild(skb_l);
sdivs.appendChild(skf_l);
sdivs.appendChild(document.createElement("br"));
sdivs.appendChild(cvs);

cvs.style.setProperty('background','#167ac6','important');
cvs.style.setProperty('visibility','visible','important');
cvs.style.setProperty('float','initial','important');

let anc=getAncestors(vid);
let fpt=anc[anc.length-1];

fpt.insertAdjacentElement('beforebegin', sdivs);

obj.skb_l=skb_l;
obj.skb=skb;
obj.skf=skf;
obj.skf_l=skf_l;
obj.cvs=cvs;
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
obj.entered_cvs=false;
obj.lowest=0;
obj.rightest=0;
obj.sDivsCSS2="";
obj.sclr=false;
obj.ignClk=false;
obj.obscPrg={};
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
skb_l.addEventListener("click", sk_l_bk(obj));	
skf_l.addEventListener("click", sk_l_fw(obj));	
cvs.addEventListener("click", (evt) =>cvs_hdl(evt,obj,0));
cvs.addEventListener("pointermove", (evt) =>cvs_hdl(evt,obj,1));
cvs.addEventListener("pointerenter", (evt) =>cvs_hdl(evt,obj,2));
cvs.addEventListener("pointerleave", (evt) =>cvs_hdl(evt,obj,3));
cvs.addEventListener("wheel", (evt) =>cvs_whl(evt,obj));
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
			def_retCSS(i,false,true);
		};
}

function sk_bk(i){
			return function() {

				if(prefPerc && isFinite(i.video.duration)){
					i.video.currentTime=Math.max(0,i.video.currentTime-0.01*skp*i.video.duration);
					i.cmu_sk=i.cmu_sk-skp;
					
					if(i.cmu_sk<-1*skp){
						i.skf.innerHTML='+'+skp.toLocaleString('en-GB', {minimumFractionDigits: 0, maximumFractionDigits: 7, useGrouping: false})+'%'; 
						i.skb.innerHTML=i.cmu_sk.toLocaleString('en-GB', {minimumFractionDigits: 0, maximumFractionDigits: 7, useGrouping: false})+'%'; 
					}else if(i.cmu_sk>skp){
						i.skb.innerHTML='-'+skp.toLocaleString('en-GB', {minimumFractionDigits: 0, maximumFractionDigits: 7, useGrouping: false})+'%'; 
						i.skf.innerHTML='+'+i.cmu_sk.toLocaleString('en-GB', {minimumFractionDigits: 0, maximumFractionDigits: 7, useGrouping: false})+'%'; 
					}else{
						i.skb.innerHTML='-'+skp.toLocaleString('en-GB', {minimumFractionDigits: 0, maximumFractionDigits: 7, useGrouping: false})+'%'; 	
						i.skf.innerHTML='+'+skp.toLocaleString('en-GB', {minimumFractionDigits: 0, maximumFractionDigits: 7, useGrouping: false})+'%'; 
					}
					
				}else{
					i.video.currentTime=Math.max(0,i.video.currentTime-sks);
					i.cmu_sk=i.cmu_sk-sks;
					
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
					
				}

			};
}

function sk_fw(i){
	return function() {
			if(prefPerc){
				if(isFinite(i.video.duration)){
					i.video.currentTime=Math.min(i.video.duration,i.video.currentTime+0.01*skp*i.video.duration);
					
					i.cmu_sk+=skp;
					if(i.cmu_sk>skp){
						i.skb.innerHTML='-'+skp.toLocaleString('en-GB', {minimumFractionDigits: 0, maximumFractionDigits: 7, useGrouping: false})+'%'; 
						i.skf.innerHTML='+'+i.cmu_sk.toLocaleString('en-GB', {minimumFractionDigits: 0, maximumFractionDigits: 7, useGrouping: false})+'%'; 
					}else if(i.cmu_sk<-1*skp){
						i.skf.innerHTML='+'+skp.toLocaleString('en-GB', {minimumFractionDigits: 0, maximumFractionDigits: 7, useGrouping: false})+'%'; 
						i.skb.innerHTML=i.cmu_sk.toLocaleString('en-GB', {minimumFractionDigits: 0, maximumFractionDigits: 7, useGrouping: false})+'%'; 
					}else{
						i.skb.innerHTML='-'+skp.toLocaleString('en-GB', {minimumFractionDigits: 0, maximumFractionDigits: 7, useGrouping: false})+'%'; 	
						i.skf.innerHTML='+'+skp.toLocaleString('en-GB', {minimumFractionDigits: 0, maximumFractionDigits: 7, useGrouping: false})+'%'; 
					}

				}else{
					i.video.currentTime+=sks;
					
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
					
				}
			}else{
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
				
			}

	};
}

function sk_l_bk(i){
	return function() {
				let under_half=false;
				
				if(isFinite(i.video.duration)){
					under_half=(i.video.currentTime<0.5*i.video.duration)?true:false;
				}
				
				if(under_half){
					let c_i=i.video.currentTime;
					for (let k=0, len=i.video.buffered.length; k<len; k++){
						let t_i=i.video.buffered.end(k);
						let s_i=i.video.buffered.start(k);
						
							if(s_i<=c_i && t_i>= c_i){
								if(k==0){
									i.video.currentTime=s_i;
								}else{
										i.video.currentTime=i.video.buffered.start(k-1);
								}
								break;
							}
					}		
				}else{
						let c_i=i.video.currentTime;
						for (let k=i.video.buffered.length-1; k>=0; k--){
						let t_i=i.video.buffered.end(k);
						let s_i=i.video.buffered.start(k);
						
							if(s_i<=c_i && t_i>= c_i){
								if(k==0){
									i.video.currentTime=s_i;
								}else{
										i.video.currentTime=i.video.buffered.start(k-1);
								}
								break;
							}
					}
					
				}
				drawBuffered(i);
	}
}

function sk_l_fw(i){
	return function() {	
	let under_half=false;
				
				if(isFinite(i.video.duration)){
					under_half=(i.video.currentTime<0.5*i.video.duration)?true:false;
				}
				
				if(under_half){
					let c_i=i.video.currentTime;
					for (let k=0, len=i.video.buffered.length; k<len; k++){
						let t_i=i.video.buffered.end(k);
						let s_i=i.video.buffered.start(k);
						
							if(s_i<=c_i && t_i>= c_i){
								if(k<len-1){
										i.video.currentTime=i.video.buffered.start(k+1);
								}
								break;
							}
					}		
				}else{
						let c_i=i.video.currentTime;
						for (let len=i.video.buffered.length, k=len-1; k>=0; k--){
						let t_i=i.video.buffered.end(k);
						let s_i=i.video.buffered.start(k);
						
							if(s_i<=c_i && t_i>= c_i){
								if(k<len-1){
										i.video.currentTime=i.video.buffered.start(k+1);
								}
								break;
							}
					}
					
				}
				drawBuffered(i);
	}
}

function cvs_hdl(e,i,m){
	if(m==3){
		i.entered_cvs=false;
		clearTimeout(i.timer3);
		i.timer3 = setTimeout(function(){
			if(!i.entered_cvs){
					i.cvs.style.setProperty('opacity',(i.entered ? 0.64 : 0),'important');
			}
		},1250);
	}else{
		if(m==1 || m==2){
			i.entered_cvs=true;
			i.cvs.style.setProperty('opacity',0.84,'important');
					clearTimeout(i.timer3);
		i.timer3 = setTimeout(function(){
					i.cvs.style.setProperty('opacity',(i.entered || i.entered_cvs ? 0.64 : 0),'important');
		},3000);
		}
	let s=parseFloat(i.cvs.getAttribute('start'));
	let t=parseFloat(i.cvs.getAttribute('end'));
	let l;
	if(Object.keys(i.obscPrg).length>0){
		l=(i.obscPrg.x-i.obscPrg.l)/i.obscPrg.w;
		i.obscPrg={};
	}else{
		l=e.offsetX/e.target.scrollWidth;
	}
	let time=(1-l)*s+l*t;
	if(!isNaN(time) && isFinite(time)){
		i.cvs.title=bf_s_hmmss(time,true);
		if((m==0) || (m>=1 && e.buttons!=0)){
			i.video.currentTime=time;
		}
	}
}
}

function cvs_whl(e,i){
	if (e.deltaY < 0)
	{
		i.skf.click();
	}
	if (e.deltaY > 0)
	{
		i.skb.click();
	}
}

function checker(){
			let DOMvids=[
			...document.getElementsByTagName('video'),
			...document.getElementsByTagName('audio')
			];

			for (let j=0; j<DOMvids.length; j++){
				let found=(global.monitored.includes(DOMvids[j]))?true:false;
				let instVid=global.instances.map((i)=>{return i.video;});
				
				if(!found){
					let found=(instVid.includes(DOMvids[j]))?true:false;
				}
		
				if(!found){
					global.monitored.push(DOMvids[j]);
					DOMvids[j].addEventListener('progress',progress_hdl_chk);
				}
				
				found=(instVid.includes(DOMvids[j]))?true:false;
				
				if(!found){
					 if(eligVid(DOMvids[j])){
						 if(global.monitored.includes(DOMvids[j])){
							 DOMvids[j].removeEventListener('progress',progress_hdl_chk);
							 global.monitored=removeEls(DOMvids[j],global.monitored);
						 }
						 creator(DOMvids[j]);
					 }
				}
				
			}
			
			for(let n=0; n<global.monitored.length; n++){
				let vid=global.monitored[n];
				if(!checkInclude(DOMvids,vid)){
					global.monitored=removeEls(vid,global.monitored);
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
					elRemover(inst.cvs);
					elRemover(inst.sdivs);
					global.instances=removeEls(inst,global.instances);
					}
				}
			}
	}

restore_options();