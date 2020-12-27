var ff = [];
var butn = [];
var clse = [];
var sdivs = [];
var videoTags=[];
var bdkCol="buttonface";
var clck_a=-1;
var t_a=0;
var clck_b=0;
var m_c=0;
var m_l=0;
var pg_e=0;
var wh_e=1;
var clk_e=0;
var skd_e=0;
var ip_e=0;
var rc_e=0;
var trk=0;
var trk2=0;

function get_src(vid){
	if (vid.src !== "") {
		return vid.src;
	} else if (vid.currentSrc !== "") {
		return vid.currentSrc;
	}else{
		return '';
	}
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
if(clck_a==-1){
	t_a=videoTags[i].currentTime;
	videoTags[i].playbackRate=clse[i].valueAsNumber;
	clck_a = performance.now();
}else{
for (let k=videoTags[i].buffered.length-1; k>=0; k--){	
let t_i=videoTags[i].buffered.end(k);
let s_i=videoTags[i].buffered.start(k);
if(videoTags[i].currentTime<=t_i && videoTags[i].currentTime>=s_i){

	if(t_i>t_a){
		clck_b = performance.now();
		lst=Math.floor((100000*((t_i-t_a)/(clck_b-clck_a))))*0.01;
		videoTags[i].playbackRate=Math.min(clse[i].valueAsNumber,Math.max(1,lst));
		t_a=t_i;
		clck_a=performance.now();
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

function seeked_hdl(i) {
if(skd_e==1){
if(videoTags[i].readyState>2){
calcSp(i);
}else{
videoTags[i].playbackRate=1;
}
}
}

function ratechange_hdl(i) {
if(rc_e==1){
butn[i].innerHTML = "Fast forwarding: "+videoTags[i].playbackRate.toLocaleString('en-GB', {minimumFractionDigits: 0, maximumFractionDigits: 7})+"x";
if(videoTags[i].readyState>2){
	calcSp(i);
}
}
}

function cl_inp(i) {
if(ip_e==1){
videoTags[i].playbackRate=Math.min(16,Math.max(1,clse[i].valueAsNumber));
calcSp(i);
}
}


function cl_whl(evt,i) {
	if(wh_e==1){
	evt.preventDefault();
	evt.stopPropagation();

	if(evt.deltaY>0){
		clse[i].value=(Math.max(1,clse[i].valueAsNumber-parseFloat(clse[i].step))).toLocaleString('en-GB', {minimumFractionDigits: 0, maximumFractionDigits: 7});
		cl_inp(i);
	}
	if (evt.deltaY<0){
		clse[i].value=(Math.min(16,clse[i].valueAsNumber+parseFloat(clse[i].step))).toLocaleString('en-GB', {minimumFractionDigits: 0, maximumFractionDigits: 7});
		cl_inp(i);
	}
	}
}

function cl_clk() {
if(clk_e==1){
event.preventDefault();
event.stopPropagation();
}
}

chrome.runtime.onMessage.addListener(gotMessage);

function gotMessage(message, sender, sendResponse) {
        //console.log(message);
		switch (message.message) {
						
                case "Scan!":

						getStrms();
						function getStrms(){

						                        var tmpVidTags = [
    ...document.getElementsByTagName('video'),
    ...document.getElementsByTagName('audio')
];

if (videoTags.length==0){
	videoTags=tmpVidTags;
	  trk=0;
	for (let k = 0; k<videoTags.length; k++) {
	if (!((get_src(videoTags[k])!='') && (videoTags[k].readyState != 0))) {
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
	if (!((get_src(videoTags[k])!='') && (videoTags[k].readyState != 0))) {
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
		
                        function b_hide(b, v) {
                                function cursorhide() {
									if((typeof b.childNodes[0]!=="undefined")&&(typeof b.childNodes[1]!=="undefined")){
									bdkCol=(b.childNodes[0].getAttribute("grn_synced")=="true")?"#00e900":"buttonface";
                                        if (!hide) {
												b.style.cssText = "display: initial !important; visibility: initial !important; z-index: "+Number.MAX_SAFE_INTEGER+" !important; position: absolute !important; background-color: transparent !important; transform: translate(0.1ch, 5.5ch) !important;";
												if (b.childNodes.length==2){
													b.childNodes[0].style.cssText = "display: initial !important; visibility:initial !important;  webkit-text-fill-color: black !important; border-width: 2px !important; border-style: outset !important; background-color: "+bdkCol+" !important; border-color: "+bdkCol+" !important";
													b.childNodes[1].style.cssText = "display: initial !important; visibility: initial !important; background-color: #de0000 !important; webkit-text-fill-color: #ececec !important; border-width: 2px !important; border-style: outset !important; border-color: #de0000 !important; width: 9ch !important";
												}
                                                clearTimeout(timer);
                                                timer = setTimeout(function() {
													if ((!(b.childNodes[0].matches(':hover')))&&(!(b.childNodes[1].matches(':hover')))){
                                                        b.style.cssText = "display: none !important; visibility: hidden !important;";
														if (b.childNodes.length==2){
															b.childNodes[0].style.cssText = "display: none !important; visibility:hidden !important;";
															b.childNodes[1].style.cssText = "display: none !important; visibility:hidden !important;";
														}
                                                        hide = true;
                                                        setTimeout(function() {
                                                                hide = false;
                                                        }, 1);
													}
                                                }, 3000);
                                        }
								}
                                }
							    v.removeEventListener('mousemove', cursorhide, true);
                                var timer;
                                var hide = false;
                                b.style.cssText = "display: initial !important; visibility: initial !important; z-index: "+Number.MAX_SAFE_INTEGER+" !important; position: absolute !important; background-color: transparent !important; transform: translate(0.1ch, 5.5ch) !important;";
								if (b.childNodes.length==2){
								bdkCol=(b.childNodes[0].getAttribute("grn_synced")=="true")?"#00e900":"buttonface";
                                b.childNodes[0].style.cssText = "display: initial !important; visibility:initial !important;  webkit-text-fill-color: black !important; border-width: 2px !important; border-style: outset !important; background-color: "+bdkCol+" !important; border-color: "+bdkCol+" !important";
                                b.childNodes[1].style.cssText = "display: initial !important; visibility: initial !important; background-color: #de0000 !important; webkit-text-fill-color: #ececec !important; border-width: 2px !important; border-style: outset !important; border-color: #de0000 !important; width: 9ch !important";
								}
                                v.addEventListener('mousemove', cursorhide, true);
                        }

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
									}
								ff[i]=-1;
                                sdivs[i] = document.createElement("div");
								clse[i] = document.createElement("input");
                                clse[i].type = "number";
                                sdivs[i].style.cssText = "display: initial !important; visibility: initial !important; z-index: "+Number.MAX_SAFE_INTEGER+" !important; position: absolute !important; background-color: transparent !important; transform: translate(0.1ch, 5.5ch) !important;";
                                butn[i] = document.createElement("button");
								butn[i].setAttribute("grn_synced", false);	
								butn[i].style.cssText = "display: initial !important; visibility: initial !important;  webkit-text-fill-color: black !important; border-width: 2px !important; border-style: outset !important; background-color: buttonface !important; border-color: buttonface !important";
                                butn[i].innerHTML = "Fast forward";
                                butn[i].className = "sync_butn";
                                video.insertAdjacentElement('beforebegin', sdivs[i]);
                                butn[i].addEventListener("click", btclk(i, src));
								clse[i].style.cssText = "display: initial !important; visibility: initial !important; background-color: #de0000 !important; webkit-text-fill-color: #ececec !important; border-width: 2px !important; border-style: outset !important; border-color: #de0000 !important; width: 9ch !important";								
                                clse[i].value =6;
								clse[i].min=1;
								clse[i].max=16;
								clse[i].step=0.5;
								wh_e=1;
								clse[i].addEventListener('wheel',(evt) => cl_whl(evt,i),true);
								clse[i].title="Maximum speed when fast forwarding; scroll to change.";
								clse[i].className = "sync_butn";
								sdivs[i].appendChild(butn[i]);
								sdivs[i].appendChild(clse[i]);
                                video.addEventListener('mouseenter', b_hide(sdivs[i], video), true);
                        }
						

                        function btclk(i, src) {
                                return function() {
									event.preventDefault();
									event.stopPropagation();
									if(ff[i]==-1){
									pg_e=1;
									clk_e=1;
									ip_e=1;
									rc_e=1;
									videoTags[i].addEventListener('progress',() => progress_hdl(i));
									videoTags[i].addEventListener('seeked',() => seeked_hdl(i));
									butn[i].innerHTML = "Fast forwarding";
									butn[i].setAttribute("grn_synced", true);
									butn[i].style.cssText="display: initial !important; visibility: initial !important; webkit-text-fill-color: black !important; border-width: 2px !important; border-style: outset !important; background-color: #00e900 !important; border-color: #00e900 !important;";
									videoTags[i].addEventListener('ratechange',() => ratechange_hdl(i));
									videoTags[i].playbackRate=clse[i].valueAsNumber;
									clse[i].addEventListener('keyup',() => cl_inp(i),true);
									clse[i].addEventListener('keydown',() => cl_inp(i),true);
									clse[i].addEventListener('change',() => cl_inp(i),true);
									clse[i].addEventListener('change',() => cl_inp(i),true);
									clse[i].addEventListener('click',cl_clk,true);
									butn[i].setAttribute("grn_synced", true);	
									ff[i]=1;
									}else if (ff[i]==0){
									pg_e=1;
									clk_e=1;
									ip_e=1;
									rc_e=1;
									videoTags[i].playbackRate=clse[i].valueAsNumber;
									butn[i].innerHTML = "Fast forwarding";
									butn[i].setAttribute("grn_synced", true);
									butn[i].style.cssText="display: initial !important; visibility: initial !important; webkit-text-fill-color: black !important; border-width: 2px !important; border-style: outset !important; background-color: #00e900 !important; border-color: #00e900 !important;";
									ff[i]=1;
									}else{
									pg_e=0;
									clk_e=0;
									ip_e=0;
									rc_e=0;
									videoTags[i].playbackRate=1;
									butn[i].setAttribute("grn_synced", false);	
									butn[i].style.cssText = "display: initial !important; visibility: initial !important;  webkit-text-fill-color: black !important; border-width: 2px !important; border-style: outset !important; background-color: buttonface !important; border-color: buttonface !important";
									butn[i].innerHTML = "Fast forward";
									ff[i]=0;
									}
                                };
                        }

                        break;
						
                default:
                        ;
                        break;
        }
}