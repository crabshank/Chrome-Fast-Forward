var global={instances:[]};

var bdkCol="buttonface";
var txCol="black";
var bdkCol2="#f0f0f080";
var dfSpd=2.2;
var dfStp=0.1;
var mbMde=false;

var sDivsCSS="max-width: max-content !important; line-height: 0px !important; padding: 0px !important; display: flex !important; visibility: initial !important; z-index: "+Number.MAX_SAFE_INTEGER+" !important; position: absolute !important; background-color: transparent !important; flex-direction: row !important;";

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

function def_retCSS(i){
	
i.sdivs.style.cssText = sDivsCSS;

bdkCol=(i.butn.getAttribute("grn_synced")=="true")?"#007500":"buttonface";
txCol=(i.butn.getAttribute("grn_synced")=="true")?"white":"black";
bdkCol2=(i.butn.getAttribute("grn_synced")=="true")?"#00750080":"#f0f0f080";
i.butn.style.cssText = "line-height: 1.91ch !important; transform: translate(0, 0.06ch) !important; padding: 0 0.25ch 0 0 !important; display: initial !important; visibility:initial !important;  webkit-text-fill-color: black !important; border-width: 2px !important; border-style: outset !important; background-color: "+bdkCol+" !important; border-color: "+bdkCol+" !important; min-width: 9ch !important; text-align-last: right !important; color: "+txCol+" !important";
i.clse.style.cssText = "line-height: 2ch !important; padding: 2px 0 2px 4px !important; display: initial !important; visibility: initial !important; background-color: #f00000 !important; webkit-text-fill-color: #ececec !important;  border-width: 0px !important; border-style: outset !important; border-color: #f00000 !important; width: 9ch !important; color: white !important";

clearTimeout(i.timer2);
i.timer2 = setTimeout(function(){
	if(!i.entered){
		if(mbMde){
i.butn.style.cssText = "line-height: 1.91ch !important; transform: translate(0, 0.06ch) !important; padding: 0 0.25ch 0 0 !important; display: initial !important; visibility:initial !important;  webkit-text-fill-color: black !important; border-width: 2px !important; border-style: outset !important; background-color: "+bdkCol2+" !important; border-color: #00000000 !important; min-width: 9ch !important; text-align-last: right !important; "+txCol+" !important";
i.clse.style.cssText = "line-height: 2ch !important; padding: 2px 0 2px 4px !important; display: initial !important; visibility: initial !important; background-color: rgb(240 0 0 / 50%) !important; webkit-text-fill-color: #ececec !important; border-width: 0px !important; border-style: outset !important; border-color: rgb(0 0 0 / 0.04) !important; width: 9ch !important; color: white !important";
		}else{
			i.sdivs.style.cssText = sDivsCSS+" opacity: 0 !important";
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

function calcSp(i){
	if(!i.video.paused){
		if(i.clck_a==-1){
				i.t_a=i.video.currentTime;
			i.clck_a = performance.now();
		}else{
			let c_i=i.video.currentTime;
			i.clck_b = performance.now();
			for (let k=i.video.buffered.length-1; k>=0; k--){
			let t_i=i.video.buffered.end(k);
			let s_i=i.video.buffered.start(k);
			
			if(t_i==i.video.duration && c_i>=s_i){
				let vN=(Number.isNaN(i.clse.valueAsNumber))?1:i.clse.valueAsNumber;
				i.video.playbackRate=vN;
				break;
			}else{
				
				if(c_i<=t_i && c_i>=s_i){
				if(t_i>i.t_a){
						let perSc=Math.abs(t_i-i.t_a)/(i.clck_b-i.clck_a);
						lst=100000*perSc;
						lst=Math.floor(lst)*0.01;
						i.pg=(i.pg==1)?2:i.pg;
						i.perSec=(i.pg==2)?lst.toLocaleString('en-GB', {minimumFractionDigits: 0, maximumFractionDigits: 2, useGrouping: false}):i.perSec;
						i.t_a=t_i;
						let vN=(Number.isNaN(i.clse.valueAsNumber))?1:i.clse.valueAsNumber;
						vN=Math.min(vN,Math.max(1,lst));
						if(i.video.playbackRate==vN){
							i.butn.innerHTML=(parseFloat(i.perSec)>vN)?"(Max: "+i.perSec+"x) "+i.video.playbackRate.toLocaleString('en-GB', {minimumFractionDigits: 0, maximumFractionDigits: 7})+"x":i.video.playbackRate.toLocaleString('en-GB', {minimumFractionDigits: 0, maximumFractionDigits: 7})+"x";
						}else{
							i.video.playbackRate=vN;
						}
				}else{
					i.t_a=c_i;
				}
				i.clck_a=performance.now();
				break;
			}else if(c_i>t_i){
				break;
			}
				
				
				
			}
			
			


			}
		}
	}
}

function progress_hdl(event) {
let i=findInst(event.target);
if(!!i){
if(i.pg_e==1){
if(i.video.readyState>2){
i.pg=1;
calcSp(i);
}else{
i.video.playbackRate=1;
}
}
}
}

function play_hdl(event) {
let i=findInst(event.target);
if(!!i){
if(i.pl_e==1){
if(i.video.readyState>2){
calcSp(i);
}else{
i.video.playbackRate=1;
}
}
}
}

function waiting_hdl(event) {
let i=findInst(event.target);
if(!!i){
if(i.wt_e==1){
i.video.playbackRate=1;
def_retCSS(i);
}
}
}

function mouseenter_hdl(i) {
i.entered=true;
def_retCSS(i);
}

function mousemove_hdl(event) {
let i=findInst(event.target);
if(!!i){
def_retCSS(i);
}
}

function mouseleave_hdl(i) {
i.entered=false;
def_retCSS(i);
}

function seeked_hdl(event) {
let i=findInst(event.target);
if(!!i){
i.entered=false;
def_retCSS(i);
if(i.skd_e==1){
t_a=i.video.currentTime;
if(i.video.readyState<=2){
i.video.playbackRate=1;
}
}
}
}

function seeking_hdl(event) {
let i=findInst(event.target);
if(!!i){
i.entered=true;
def_retCSS(i);
/*if(i.skd_e==1){
i.butn.innerHTML=i.video.playbackRate.toLocaleString('en-GB', {minimumFractionDigits: 0, maximumFractionDigits: 7})+"x";
}*/
}
}

function ratechange_hdl(event) {
let i=findInst(event.target);
if(!!i){
if(i.rc_e==1){
let vN=(Number.isNaN(i.clse.valueAsNumber))?1:i.clse.valueAsNumber;
if(i.pg==2 && parseFloat(i.perSec)>vN && i.video.playbackRate==vN){
	i.butn.innerHTML="(Max: "+i.perSec+"x) "+i.video.playbackRate.toLocaleString('en-GB', {minimumFractionDigits: 0, maximumFractionDigits: 7})+"x";
	i.pg=0;
}else{
	i.butn.innerHTML=i.video.playbackRate.toLocaleString('en-GB', {minimumFractionDigits: 0, maximumFractionDigits: 7})+"x";
}
	
if(i.video.readyState>2){
	calcSp(i);
}
}else{
	i.butn.innerHTML=i.video.playbackRate.toLocaleString('en-GB', {minimumFractionDigits: 0, maximumFractionDigits: 7})+"x";
}
}
}

function cl_inp(i) {
//event.preventDefault();
event.stopPropagation();
def_retCSS(i);
if(i.ip_e==1){
let vN=(Number.isNaN(i.clse.valueAsNumber))?1:i.clse.valueAsNumber;
dfSpd=Math.min(16,Math.max(1,vN));
i.video.playbackRate=dfSpd;
	calcSp(i);

}
}


function cl_whl(evt,i) {
	evt.preventDefault();
	evt.stopPropagation();
	def_retCSS(i);
		if(evt.deltaY>0){
		let vN=(Number.isNaN(i.clse.valueAsNumber))?1:i.clse.valueAsNumber;
		dfSpd=(Math.max(1,vN-parseFloat(i.clse.step))).toLocaleString('en-GB', {minimumFractionDigits: 0, maximumFractionDigits: 7, useGrouping:false});
		i.clse.value=dfSpd;
		if(i.wh_e==1){
		i.video.playbackRate=dfSpd;
		}
		}
		if (evt.deltaY<0){
		let vN=(Number.isNaN(i.clse.valueAsNumber))?1:i.clse.valueAsNumber;
		dfSpd=(Math.min(16,vN+parseFloat(i.clse.step))).toLocaleString('en-GB', {minimumFractionDigits: 0, maximumFractionDigits: 7, useGrouping:false});
		i.clse.value=dfSpd;
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
def_retCSS(i);
//if(clk_e==1){}
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
			dfSpd = items.defSpd;
			dfStp = items.defStp;
			mbMde = items.mob;
			checker();
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
	}, function()
	{
		console.log('Default options saved.');
		restore_options();
	});

}

function creator(vid){

var obj={};

obj.video=vid;
obj.ff=-1;
let butn = document.createElement("button");
let sdivs = document.createElement("div");
let clse = document.createElement("input");
clse.type = "number";
butn.setAttribute("grn_synced", false);	
butn.innerHTML = vid.playbackRate.toLocaleString('en-GB', {minimumFractionDigits: 0, maximumFractionDigits: 7})+"x"
butn.className = "sync_butn";

let anc=getAncestors(vid);
let fpt=anc[anc.length-1];

fpt.insertAdjacentElement('beforebegin', sdivs);

sdivs.style.cssText=sDivsCSS;
		let vrct=vid.getBoundingClientRect();
let sdrct=sdivs.getBoundingClientRect();

sDivsCSS+=' top: '+(vrct.top-sdrct.top+0.102*vrct.height+sdrct.height)+'px !important; left: 0.102em !important;';

clse.value =dfSpd;
clse.min=1;
clse.max=16;
clse.step=dfStp;

clse.title="Maximum speed when fast forwarding; scroll to change.";
clse.className = "sync_butn";
//def_retCSS();
sdivs.appendChild(butn);
sdivs.appendChild(clse);

obj.butn=butn;
obj.clse=clse;
obj.sdivs=sdivs;

obj.pg_e=0;
obj.wt_e=0;
obj.pl_e=0;
obj.skd_e=0;
obj.rc_e=0;
obj.wh_e=0;
obj.ip_e=0;
obj.perSec='';
obj.clck_a=-1;
obj.t_a=0;
obj.clck_b=0;
obj.pg_e=0;
obj.wh_e=0;
obj.pg=0;
//obj.clk_e=0;
obj.timer2;
obj.entered=false;

global.instances.push(obj);
def_retCSS(obj);
butn.addEventListener("click", btclk(obj));	
sdivs.addEventListener('wheel',(evt) => cl_whl(evt,obj));
vid.addEventListener('ratechange',ratechange_hdl);

clse.addEventListener('keyup',() => cl_inp(obj));
clse.addEventListener('keydown',() => cl_inp(obj));
clse.addEventListener('change',() => cl_inp(obj));
clse.addEventListener('change',() => cl_inp(obj));
clse.addEventListener('click',() => cl_clk(obj));
sdivs.addEventListener('click',() => cl_clk(obj));
butn.addEventListener('click',() => cl_clk(obj));
clse.addEventListener('mousedown',() => cl_clk(obj));
sdivs.addEventListener('mousedown',() => cl_clk(obj));
butn.addEventListener('mousedown',() => cl_clk(obj));
clse.addEventListener('pointerdown',() => cl_clk(obj));
sdivs.addEventListener('pointerdown',() => cl_clk(obj));
butn.addEventListener('pointerdown',() => cl_clk(obj));
sdivs.addEventListener('mouseenter',() => mouseenter_hdl(obj));
sdivs.addEventListener('mouseleave',() => mouseleave_hdl(obj));
vid.addEventListener('mousemove',mousemove_hdl);
vid.addEventListener('seeked',seeked_hdl);
vid.addEventListener('seeking',seeking_hdl);
}

function btclk(i) {
		return function() {
			event.preventDefault();
			event.stopPropagation();
			if(i.ff==-1){
			chgFlgs(i,true);
			i.video.addEventListener('progress',progress_hdl);
			i.video.addEventListener('play',play_hdl);
			i.video.addEventListener('waiting',waiting_hdl);
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
			i.butn.innerHTML="1x";
			i.butn.setAttribute("grn_synced", false);	
			i.ff=0;
			}
			def_retCSS(i);
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
						i.video.removeEventListener('mousemove',mousemove_hdl);
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
					elRemover(inst.sdivs);
					global.instances=removeEls(inst,global.instances);
					}
				}
			}
						
	}

restore_options();


		if(typeof observer ==="undefined" && typeof timer ==="undefined" ){
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