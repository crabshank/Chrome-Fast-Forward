var ff = [];
var butn = [];
var clse = [];
var sdivs = [];
var videoTags=[];
var perSec=[];
var bdkCol="buttonface";
var bdkCol2="#f0f0f080";
var clck_a=-1;
var t_a=0;
var clck_b=0;
var m_c=0;
var m_l=0;
var pg_e=0;
var wh_e=0;
//var clk_e=0;
var skd_e=0;
var ip_e=0;
var rc_e=0;
var wt_e=0;
var pl_e=0;
var trk=0;
var trk2=0;
var dfSpd=6;
var dfStp=0.5;
var mbMde=false;
var timer2;
var entered=false;
var yt=[];

function def_retCSS(i){
var d_yt="display: initial !important; visibility: initial !important; z-index: "+Number.MAX_SAFE_INTEGER+" !important; position: absolute !important; background-color: transparent !important; transform: translate(0.164vw, 0.92vh) !important;";
var d="display: initial !important; visibility: initial !important; z-index: "+Number.MAX_SAFE_INTEGER+" !important; position: absolute !important; background-color: transparent !important; transform: translate(0.164vw, 9.75vh) !important;";
if(yt[i]){
	sdivs[i].style.cssText = d_yt;
}else{
	sdivs[i].style.cssText = d;
}
bdkCol=(butn[i].getAttribute("grn_synced")=="true")?"#007500":"buttonface";
bdkCol2=(butn[i].getAttribute("grn_synced")=="true")?"#00750080":"#f0f0f080";
butn[i].style.cssText = "display: initial !important; visibility:initial !important;  webkit-text-fill-color: black !important; border-width: 2px !important; border-style: outset !important; background-color: "+bdkCol+" !important; border-color: "+bdkCol+" !important; padding-right: 0.44ch !important; min-width: 9ch !important; text-align-last: right !important; color: white !important";
clse[i].style.cssText = "display: initial !important; visibility: initial !important; background-color: #f00000 !important; webkit-text-fill-color: #ececec !important;  border-width: 0px !important; padding-bottom: 2px !important; padding-top: 2px !important; border-style: outset !important; border-color: #f00000 !important; width: 9ch !important; padding-left: 4px !important; color: white !important";

clearTimeout(timer2);
timer2 = setTimeout(function(){
	if(!entered){
		if(mbMde){
butn[i].style.cssText = "display: initial !important; visibility:initial !important;  webkit-text-fill-color: black !important; border-width: 2px !important; border-style: outset !important; background-color: "+bdkCol2+" !important; border-color: #00000000 !important; padding-right: 0.44ch !important; min-width: 9ch !important; text-align-last: right !important; color: white !important";
clse[i].style.cssText = "display: initial !important; visibility: initial !important; background-color: rgb(240 0 0 / 50%) !important; webkit-text-fill-color: #ececec !important; border-width: 0px !important; padding-bottom: 2px !important; padding-top: 2px !important; border-style: outset !important; border-color: rgb(0 0 0 / 0.04) !important; width: 9ch !important; padding-left: 4px !important; color: white !important";
		}else{
			if(yt[i]){
			sdivs[i].style.cssText = d_yt+" opacity: 0 !important";
			}else{
			sdivs[i].style.cssText = d+" opacity: 0 !important";
			}
		}
		
	}
}, 3000);

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
	for (let i = 0; i < arr.length; i++) {
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

function calcSp(i){
	let vN=(Number.isNaN(clse[i].valueAsNumber))?1:clse[i].valueAsNumber;
	if(vN>1){
if(clck_a==-1){
		t_a=videoTags[i].currentTime;
	clck_a = performance.now();
}else{
let c_i=videoTags[i].currentTime;
for (let k=videoTags[i].buffered.length-1; k>=0; k--){
clck_b = performance.now();
let t_i=videoTags[i].buffered.end(k);
let s_i=videoTags[i].buffered.start(k);
if(c_i<=t_i && c_i>=s_i){

	if(t_i>t_a){
		let perSc=Math.abs(t_i-t_a)/(clck_b-clck_a);
		lst=100000*perSc;
		lst=Math.floor(lst)*0.01;
		perSec[i]=lst.toLocaleString('en-GB', {minimumFractionDigits: 0, maximumFractionDigits: 2});
		skd_e=(skd_e==2)?1:skd_e;
		t_a=t_i;
		let vN=(Number.isNaN(clse[i].valueAsNumber))?1:clse[i].valueAsNumber;
		videoTags[i].playbackRate=Math.min(vN,Math.max(1,lst));
		clck_a=performance.now();
		break;
	}
}else if(c_i>t_i){
	break;
}

}
}
}
}

function progress_hdl(i) {
if(pg_e==1){
if(videoTags[i].readyState>2){
calcSp(i);
}else{
videoTags[i].playbackRate=1;
}
}
}

function play_hdl(i) {
if(pl_e==1){
if(videoTags[i].readyState>2){
calcSp(i);
}else{
videoTags[i].playbackRate=1;
}
}
}

function waiting_hdl(i) {
if(wt_e==1){
videoTags[i].playbackRate=1;
}
}

function mouseenter_hdl(i) {
entered=true;
def_retCSS(i);
}

function mouseleave_hdl(i) {
entered=false;
def_retCSS(i);
}

function seeked_hdl(i) {
if(skd_e>=1){
butn[i].innerHTML=videoTags[i].playbackRate.toLocaleString('en-GB', {minimumFractionDigits: 0, maximumFractionDigits: 7})+"x";
skd_e=2;
if(videoTags[i].readyState<=2){
videoTags[i].playbackRate=1;
}
}
}

function ratechange_hdl(i) {
if(rc_e==1){
	if(parseFloat(perSec[i])>0 && skd_e!=2){
		if(parseFloat(perSec[i])>videoTags[i].playbackRate && videoTags[i].playbackRate>1){
			butn[i].innerHTML= "(Max: "+perSec[i]+"x) "+videoTags[i].playbackRate.toLocaleString('en-GB', {minimumFractionDigits: 0, maximumFractionDigits: 7})+"x";
		}else{
			butn[i].innerHTML=videoTags[i].playbackRate.toLocaleString('en-GB', {minimumFractionDigits: 0, maximumFractionDigits: 7})+"x";
		}
	}else{
		butn[i].innerHTML=videoTags[i].playbackRate.toLocaleString('en-GB', {minimumFractionDigits: 0, maximumFractionDigits: 7})+"x";
	}
		
if(videoTags[i].readyState>2 && skd_e!=2){
	calcSp(i);
}
}
}

function cl_inp(i) {
//event.preventDefault();
event.stopPropagation();
def_retCSS(i);
if(ip_e==1){
let vN=(Number.isNaN(clse[i].valueAsNumber))?1:clse[i].valueAsNumber;
videoTags[i].playbackRate=Math.min(16,Math.max(1,vN));
if(skd_e!=2){
	calcSp(i);
}
}
}


function cl_whl(evt,i) {
	evt.preventDefault();
	evt.stopPropagation();
	def_retCSS(i);
		if(evt.deltaY>0){
		let vN=(Number.isNaN(clse[i].valueAsNumber))?1:clse[i].valueAsNumber;
		clse[i].value=(Math.max(1,vN-parseFloat(clse[i].step))).toLocaleString('en-GB', {minimumFractionDigits: 0, maximumFractionDigits: 7});
		}
		if (evt.deltaY<0){
		let vN=(Number.isNaN(clse[i].valueAsNumber))?1:clse[i].valueAsNumber;
		clse[i].value=(Math.min(16,vN+parseFloat(clse[i].step))).toLocaleString('en-GB', {minimumFractionDigits: 0, maximumFractionDigits: 7});
		}
	if(wh_e==1){
		cl_inp(i);
	}

}

function cl_clk(i) {
event.preventDefault();
event.stopPropagation();
def_retCSS(i);
//if(clk_e==1){}
}

restore_options();

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
		defSpd: 6,
		defStp: 0.5,
		mob: false,
	}, function()
	{
		console.log('Default options saved.');
	});

}

function go() {
						function getStrms(){

						                        var tmpVidTags = [
    ...document.getElementsByTagName('video'),
    ...document.getElementsByTagName('audio')
];

if (videoTags.length==0){
	videoTags=tmpVidTags;
	  trk=0;
	for (let k = 0; k<videoTags.length; k++) {
	if (!eligVid(videoTags[k])){
		 videoTags=removeEls(videoTags[k], videoTags);
	}
	}
}else{
		  trk2=(videoTags.length==0)?0:videoTags.length;
		  
for (let k = 0; k<tmpVidTags.length; k++) {
	if (!videoTags.includes(tmpVidTags[k])) {
		 videoTags.push(tmpVidTags[k]);
		 trk=trk2;
	}
}
	for (let k = trk; k<videoTags.length; k++) {
	if (!eligVid(videoTags[k])){
		 videoTags=removeEls(videoTags[k], videoTags);
		 trk--;
	}
	}

}
   

						
						for (let i = trk; i<videoTags.length; i++) {
                            createbutn(i, videoTags[i], get_src(videoTags[i]));
						}
						
						 if (videoTags.length>1){ 
						 console.log(videoTags);
						 }else if (videoTags.length==1){
						 console.log(videoTags[0]);
						 }
							
                        
						}
												getStrms();

					
                        function createbutn(i, video, src) {
                       				for (let j=0; j<i; j++){
										if (typeof butn[j]==="undefined"){
											butn[j]="";
										}
										if (typeof sdivs[j]==="undefined"){
											sdivs[j]="";
										}
										if (typeof clse[j]==="undefined"){
											clse[j]="";
										}
										if (typeof ff[j]==="undefined"){
											ff[j]="";
										}
										if (typeof perSec[j]==="undefined"){
											perSec[j]="";
										}if (typeof yt[j]==="undefined"){
											yt[j]=false;
										}
									}
								ff[i]=-1;
								perSec[i]=0;
                                sdivs[i] = document.createElement("div");
								clse[i] = document.createElement("input");
                                clse[i].type = "number";
                                
                                butn[i] = document.createElement("button");
								butn[i].setAttribute("grn_synced", false);	
                                butn[i].innerHTML = videoTags[i].playbackRate.toLocaleString('en-GB', {minimumFractionDigits: 0, maximumFractionDigits: 7})+"x"
                                butn[i].className = "sync_butn";
								if (window.location.href.startsWith('https://m.youtube.com/') && !!video.offsetParent.offsetParent.offsetParent){
								yt[i]=true;
								video.offsetParent.offsetParent.offsetParent.insertAdjacentElement('beforebegin',sdivs[i]);
								//sdivs[i].style.setProperty("transform", " ", "important");
								sdivs[i].style.cssText = "display: initial !important; visibility: initial !important; z-index: "+Number.MAX_SAFE_INTEGER+" !important; position: absolute !important; background-color: transparent !important; transform: translate(0.164vw, 0.92vh) !important;";
								}else{
								yt[i]=false;
                                video.insertAdjacentElement('beforebegin', sdivs[i]);
								sdivs[i].style.cssText = "display: initial !important; visibility: initial !important; z-index: "+Number.MAX_SAFE_INTEGER+" !important; position: absolute !important; background-color: transparent !important; transform: translate(0.164vw, 9.75vh) !important;";
                                }
								butn[i].addEventListener("click", btclk(i, src));								
                                clse[i].value =dfSpd;
								clse[i].min=1;
								clse[i].max=16;
								clse[i].step=dfStp;
								clse[i].addEventListener('wheel',(evt) => cl_whl(evt,i),true);
								clse[i].title="Maximum speed when fast forwarding; scroll to change.";
								clse[i].className = "sync_butn";
								def_retCSS(i);
								sdivs[i].appendChild(butn[i]);
								sdivs[i].appendChild(clse[i]);
									//clk_e=1;
									clse[i].addEventListener('keyup',() => cl_inp(i));
									clse[i].addEventListener('keydown',() => cl_inp(i));
									clse[i].addEventListener('change',() => cl_inp(i));
									clse[i].addEventListener('change',() => cl_inp(i));
									clse[i].addEventListener('click',() => cl_clk(i));
									sdivs[i].addEventListener('click',() => cl_clk(i));
									butn[i].addEventListener('click',() => cl_clk(i));
									sdivs[i].addEventListener('mouseenter',() => mouseenter_hdl(i));
									sdivs[i].addEventListener('mouseleave',() => mouseleave_hdl(i));
									video.addEventListener('mouseenter',() => mouseenter_hdl(i));
									video.addEventListener('mouseleave',() => mouseleave_hdl(i));
									video.addEventListener('mousemove',() => mouseenter_hdl(i));
                        }
						

                        function btclk(i, src) {
                                return function() {
									event.preventDefault();
									event.stopPropagation();
									if(ff[i]==-1){
									pg_e=1;
									wt_e=1;
									pl_e=1;
									skd_e=1;
									rc_e=1;
									wh_e=1;
									ip_e=1;
									videoTags[i].addEventListener('progress',() => progress_hdl(i));
									videoTags[i].addEventListener('play',() => play_hdl(i));
									videoTags[i].addEventListener('waiting',() => waiting_hdl(i));
									videoTags[i].addEventListener('seeked',() => seeked_hdl(i));
									butn[i].setAttribute("grn_synced", true);
									def_retCSS(i);
									videoTags[i].addEventListener('ratechange',() => ratechange_hdl(i));
									let vN=(Number.isNaN(clse[i].valueAsNumber))?1:clse[i].valueAsNumber;
									videoTags[i].playbackRate=vN;
									butn[i].innerHTML = videoTags[i].playbackRate.toLocaleString('en-GB', {minimumFractionDigits: 0, maximumFractionDigits: 7})+"x"
									butn[i].setAttribute("grn_synced", true);	
									ff[i]=1;
									}else if (ff[i]==0){
									pg_e=1;
									wt_e=1;
									pl_e=1;
									//clk_e=1;
									skd_e=1;
									ip_e=1;
									rc_e=1;
									let vN=(Number.isNaN(clse[i].valueAsNumber))?1:clse[i].valueAsNumber;
									videoTags[i].playbackRate=vN;
									butn[i].innerHTML = videoTags[i].playbackRate.toLocaleString('en-GB', {minimumFractionDigits: 0, maximumFractionDigits: 7})+"x"
									butn[i].setAttribute("grn_synced", true);
									def_retCSS(i);
									ff[i]=1;
									}else{
									pg_e=0;
									wt_e=0;
									pl_e=0;
									//clk_e=0;
									skd_e=0;
									ip_e=0;
									rc_e=0;
									wh_e=0;
									videoTags[i].playbackRate=1;
									butn[i].setAttribute("grn_synced", false);	
									def_retCSS(i);
									butn[i].innerHTML = videoTags[i].playbackRate.toLocaleString('en-GB', {minimumFractionDigits: 0, maximumFractionDigits: 7})+"x"
									ff[i]=0;
									}
                                };
                        }


        }

go();

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
						let DOMvids=[
			...document.getElementsByTagName('video'),
			...document.getElementsByTagName('audio')
			];
			
			for (let j=0; j<videoTags.length; j++){
				if(!checkInclude(DOMvids,videoTags[j]) ||  !eligVid(videoTags[j])){
					videoTags[j]='';
					ff[j]='';
					if(typeof butn[j].parentNode!=='undefined' && !!butn[j].parentNode){
					butn[j].parentNode.removeChild(butn[j]);
					}
					butn[j]='';
					if(typeof clse[j].parentNode!=='undefined' && !!clse[j].parentNode){
					clse[j].parentNode.removeChild(clse[j]);
					}
					clse[j]='';
					if(typeof sdivs[j].parentNode!=='undefined' && !!sdivs[j].parentNode){
					sdivs[j].parentNode.removeChild(sdivs[j]);
					}
					sdivs[j]='';
					perSec[j]='';
				}
			}
				for (let k=0; k<DOMvids.length; k++){
				if(!checkInclude(videoTags,DOMvids[k]) && eligVid(DOMvids[k])){
					go();
				}
				}
				
		}, 150);
	});


	observer.observe(document,
	{
		attributes: true,
		childList: true,
		subtree: true
	});
		}
