var ff = [];
var butn = [];
var clse = [];
var sdivs = [];
var bdkCol="buttonface";
var clck_a=-1;
var t_a=0;
var clck_b=0;
var m_c=0;
var m_l=0;

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

function calcSp(myVdo,k){
if(clck_a==-1){
	t_a=myVdo.currentTime;
	myVdo.playbackRate=clse[k].valueAsNumber;
	clck_a = performance.now();
}else{
for (let i=myVdo.buffered.length-1; i>=0; i--){	
let t_i=myVdo.buffered.end(i);
let s_i=myVdo.buffered.start(i);
if(myVdo.currentTime<=t_i && myVdo.currentTime>=s_i){

	if(t_i>t_a){
		clck_b = performance.now();
		lst=Math.floor((100000*((t_i-t_a)/(clck_b-clck_a))))*0.01;
		myVdo.playbackRate=Math.min(clse[k].valueAsNumber,Math.max(1,lst));
		t_a=t_i;
		clck_a=performance.now();
		break;
	}
}

}
}

}

function progress_hdl(evt,i) {
if(evt.target.readyState>2){
calcSp(evt.target,i);
}else{
evt.target.playbackRate=1;
}
}

function ratechange_hdl(evt,i) {

butn[i].innerHTML = "Fast forwarding: "+evt.target.playbackRate.toLocaleString('en-GB', {minimumFractionDigits: 0, maximumFractionDigits: 7})+"x";

}

function cl_inp(video,i) {
calcSp(video,i);
}

function cl_whl(evt,i) {
	evt.preventDefault();
	evt.stopPropagation();

	if(evt.deltaY>0){
		clse[i].value=(Math.max(1,clse[i].valueAsNumber-parseFloat(clse[i].step))).toLocaleString('en-GB', {minimumFractionDigits: 0, maximumFractionDigits: 7});
	}
	if (evt.deltaY<0){
		clse[i].value=(Math.min(16,clse[i].valueAsNumber+parseFloat(clse[i].step))).toLocaleString('en-GB', {minimumFractionDigits: 0, maximumFractionDigits: 7});
	}
}

function cl_whl2(evt,video,i) {
	evt.preventDefault();
	evt.stopPropagation();

	if(evt.deltaY>0){
		clse[i].value=(Math.max(1,clse[i].valueAsNumber-parseFloat(clse[i].step))).toLocaleString('en-GB', {minimumFractionDigits: 0, maximumFractionDigits: 7});
		calcSp(video,i);
	}
	if (evt.deltaY<0){
		clse[i].value=(Math.min(16,clse[i].valueAsNumber+parseFloat(clse[i].step))).toLocaleString('en-GB', {minimumFractionDigits: 0, maximumFractionDigits: 7});
		calcSp(video,i);
	}
}

function cl_clk() {
event.preventDefault();
event.stopPropagation();
}

chrome.runtime.onMessage.addListener(gotMessage);

function gotMessage(message, sender, sendResponse) {
        //console.log(message);
		switch (message.message) {
						
                case "Scan!":
						                        var videoTags = [
    ...document.getElementsByTagName('video'),
    ...document.getElementsByTagName('audio')
];
var tmpVidTags = videoTags;
						getStrms();
						function getStrms(){

   
                        for (let k = 0, len = videoTags.length; k < len; k++) {
                                if ((videoTags[k].src == "") && (videoTags[k].currentSrc == "") && (videoTags[k].readyState != 0)) {
									 tmpVidTags=removeEls(videoTags[k], videoTags);
								}
                        }
						
						videoTags=tmpVidTags;
						
						for (let i = 0, len = videoTags.length; i < len; i++) {
								let source=get_src(videoTags[i]);
                                if (source !== '') {
                                        createbutn(i, videoTags[i], source);
                                }
						}
						for (let i = 0, len = videoTags.length; i < len; i++) {
							ff[i]=0;
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
												b.style.cssText = "display: initial !important; visibility: initial !important; z-index: "+Number.MAX_SAFE_INTEGER+" !important; position: absolute !important; background-color: transparent !important;";
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
                                b.style.cssText = "display: initial !important; visibility: initial !important; z-index: "+Number.MAX_SAFE_INTEGER+" !important; position: absolute !important; background-color: transparent !important;";
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
								ff[i]=0;
                                sdivs[i] = document.createElement("div");
								clse[i] = document.createElement("input");
                                clse[i].type = "number";
                                sdivs[i].style.cssText = "display: initial !important; visibility: initial !important; z-index: "+Number.MAX_SAFE_INTEGER+" !important; position: absolute !important; background-color: transparent !important;";
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
									if (ff[i]==0){
									butn[i].innerHTML = "Fast forwarding";
butn[i].style.cssText="display: initial !important; visibility: initial !important; webkit-text-fill-color: black !important; border-width: 2px !important; border-style: outset !important; background-color: #00e900 !important; border-color: #00e900 !important;";

									videoTags[i].addEventListener('progress',(evt) => progress_hdl(evt,i));
									videoTags[i].addEventListener('ratechange',(evt) => ratechange_hdl(evt,i));
									videoTags[i].playbackRate=clse[i].valueAsNumber;
									clse[i].removeEventListener('wheel',cl_whl,true);
									clse[i].addEventListener('wheel',(evt) => cl_whl2(evt,videoTags[i],i),true);
									clse[i].addEventListener('input',cl_inp(videoTags[i],i),true);
									clse[i].addEventListener('click',cl_clk,true);
									butn[i].setAttribute("grn_synced", true);	
									ff[i]=1;
									}else{
									videoTags[i].removeEventListener('progress',progress_hdl, true);
									clse[i].removeEventListener('wheel',cl_whl2,true);
									clse[i].addEventListener('wheel',(evt) => cl_whl(evt,i),true);
									clse[i].removeEventListener('click',cl_clk,true);
									clse[i].removeEventListener('input',cl_inp,true);
									videoTags[i].removeEventListener('ratechange',ratechange_hdl, true);
									videoTags[i].playbackRate=1;
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