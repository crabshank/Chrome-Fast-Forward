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
var cvs_clk=0;
var cvs_clkd=false;
var justUp=false;

var doWB=false;
var WB_defMtx,WB_defMtx_JSON,WB_defMtx_flat;

	let clrMtrx_tag=`<svg xmlns="http://www.w3.org/2000/svg">
	<filter id="clrMtrx_svg">
		<feColorMatrix type="matrix"
			values="${WB_defMtx_flat}">
		</feColorMatrix>
	</filter>
</svg>`;
					
let svg_blob = new Blob([clrMtrx_tag], { type: 'image/svg+xml' });
let svg_url = URL.createObjectURL(svg_blob);
WB_defMtx_blob=svg_url;

function hex2rgb(hex) { //Source: https://stackoverflow.com/a/12342275
	let h=hex.replace('#', '');
	h =  h.match(new RegExp('(.{'+h.length/3+'})', 'g'));

	for(let j=0, len_j=h.length; j<len_j; j++){
		h[j] = parseInt(
			(h[j].length==1? h[j]+h[j] : h[j])
			, 16
		);
	}
	return h;
}

function keepMatchesShadow(els,slcArr,isNodeName){
   if(slcArr[0]===false){
      return els;
   }else{
		let out=[];
		for(let i=0, len=els.length; i<len; i++){
		  let n=els[i];
				for(let k=0, len_k=slcArr.length; k<len_k; k++){
					let sk=slcArr[k];
					if(isNodeName){
						if((n.nodeName.toLocaleLowerCase())===sk){
							out.push(n);
						}
					}else{ //selector
						   if(!!n.matches && typeof n.matches!=='undefined' && n.matches(sk)){
							  out.push(n);
						   }
					}
				}
		}
		return out;
   	}
}

function getMatchingNodesShadow(docm, slc, isNodeName, onlyShadowRoots){
	let slcArr=[];
	if(typeof(slc)==='string'){
		slc=(isNodeName && slc!==false)?(slc.toLocaleLowerCase()):slc;
		slcArr=[slc];
	}else if(typeof(slc[0])!=='undefined'){
		for(let i=0, len=slc.length; i<len; i++){
			let s=slc[i];
			slcArr.push((isNodeName && slc!==false)?(s.toLocaleLowerCase()):s)
		}
	}else{
		slcArr=[slc];
	}
	var shrc=[docm];
	var shrc_l=1;
	var out=[];
	let srCnt=0;

	while(srCnt<shrc_l){
		let curr=shrc[srCnt];
		let sh=(!!curr.shadowRoot && typeof curr.shadowRoot !=='undefined')?true:false;
		let nk=keepMatchesShadow([curr],slcArr,isNodeName);
		let nk_l=nk.length;
		
		if( !onlyShadowRoots && nk_l>0){
			for(let i=0; i<nk_l; i++){
				out.push(nk[i]);
			}
		}
		
		for(let i=0, len=curr.childNodes.length; i<len; i++){
			shrc.push(curr.childNodes[i]);
		}
		
		if(sh){
			   let cs=curr.shadowRoot;
			   let csc=[...cs.childNodes];
			   if(onlyShadowRoots){
				  if(nk_l>0){
				   out.push({root:nk[0], childNodes:csc});
				  }
			   }
				for(let i=0, len=csc.length; i<len; i++){
					shrc.push(csc[i]);
				}
		}

		srCnt++;
		shrc_l=shrc.length;
	}
	
	return out;
}

function absBoundingClientRect(el){
	let st = [window?.scrollY,
					window?.pageYOffset,
					el?.ownerDocument?.documentElement?.scrollTop,
					document?.documentElement?.scrollTop,
					document?.body?.parentNode?.scrollTop,
					document?.body?.scrollTop,
					document?.head?.scrollTop];
					
		let sl = [window?.scrollX,
						window?.pageXOffset,
						el?.ownerDocument?.documentElement?.scrollLeft,
						document?.documentElement?.scrollLeft,
						document?.body?.parentNode?.scrollLeft,
						document?.body?.scrollLeft,
						document?.head?.scrollLeft];
						
				let scrollTop=0;
				for(let k=0; k<st.length; k++){
					if(!!st[k] && typeof  st[k] !=='undefined' && st[k]>0){
						scrollTop=(st[k]>scrollTop)?st[k]:scrollTop;
					}
				}			

				let scrollLeft=0;
				for(let k=0; k<sl.length; k++){
					if(!!sl[k] && typeof  sl[k] !=='undefined' && sl[k]>0){
						scrollLeft=(sl[k]>scrollLeft)?sl[k]:scrollLeft;
					}
				}
	
	const rct=el.getBoundingClientRect();
	let r={};

	r.left=rct.left+scrollLeft;
	r.right=rct.right+scrollLeft;
	r.top=rct.top+scrollTop;
	r.bottom=rct.bottom+scrollTop;
	r.height=rct.height;
	r.width=rct.width;
	
	return r;
}

function getParent(el,elementsOnly,doc_head_body){
if(!!el && typeof el!=='undefined'){
	let out=null;
	let curr=el;
	let end=false;
	
	while(!end){
		if(!!curr.parentNode && typeof curr.parentNode!=='undefined'){
			out=curr.parentNode;
			curr=out;
			end=(elementsOnly && out.nodeType!=1)?false:true;
		}else if(!!curr.parentElement && typeof curr.parentElement!=='undefined'){
				out=curr.parentElement;
				end=true;
				curr=out;
		}else if(!!curr.host && typeof curr.host!=='undefined'){
				out=curr.host;
				end=(elementsOnly && out.nodeType!=1)?false:true;
				curr=out;
		}else{
			out=null;
			end=true;
		}
	}
	
	if(out!==null){
		if(!doc_head_body){
			if(out.nodeName==='BODY' || out.nodeName==='HEAD' || out.nodeName==='HTML'){
				out=null;
			}
		}
	}
	
	return out;
}else{
	return null;
}
}

function getAncestors(el, elementsOnly, elToHTML, doc_head_body, notInShadow){
	let curr=el;
	let ancestors=[el];
	let outAncestors=[];
	let end=false;
	
	while(!end){
		let p=getParent(curr,elementsOnly,doc_head_body);
		if(p!==null){
			if(elToHTML){
				ancestors.push(p);
			}else{
				ancestors.unshift(p)
			}
			curr=p;
		}else{
			end=true;
		}
	}
	if(notInShadow){
		if(elToHTML){
			for(let i=ancestors.length-1; i>=0; i--){
				outAncestors.unshift(ancestors[i]);
				if(!!ancestors[i].shadowRoot && typeof ancestors[i].shadowRoot !=='undefined'){
					i=0;
				}
			}
		}else{
			for(let i=0, len=ancestors.length; i<len; i++){
				outAncestors.push(ancestors[i]);
				if(!!ancestors[i].shadowRoot && typeof ancestors[i].shadowRoot !=='undefined'){
					i=len-1;
				}
			}
		}
	}else{
		outAncestors=ancestors;
	}
	return outAncestors;
}

function hasAncestor(el,p){
	let out=false;
	let curr=el;
	let end=false;
	while(!end){
		let r=getParent(curr,false,true);
		curr=r;
		if(r===null){
			end=true;
		}else if(r===p){
			out=true;
			end=true;
		}
	}
	return out;
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
            if(found){
				blSite = array[i];
				i = array.length - 1;
			}
        }
    }
    //console.log(found);
    return [found,blSite];

}

var isCurrentSiteBlacklisted = function()
{
		return blacklistMatch(blacklist, window.location.href);
};

function forcePlaybackRate(i,noAdj){
		if(noAdj!==true && i.ff===1){
			let vN=(Number.isNaN(i.clse.valueAsNumber))?1:i.clse.valueAsNumber;
				i.video.playbackRate=vN;		
		}
		i.butn.innerText=i.video.playbackRate.toLocaleString('en-GB', {minimumFractionDigits: 0, maximumFractionDigits: 7})+"x  [Buffered: "+i.ldd+"]";
}

var sDivsCSS="all: initial !important;font-family: system-ui !important;max-width: max-content !important; line-height: 0px !important; padding: 0px !important; display: flex !important; flex-flow: column nowrap !important; justify-content: flex-start !important; align-items: stretch !important; align-content: flex-start !important; gap: 0px 0px !important; visibility: initial !important; float: initial !important; z-index: "+Number.MAX_SAFE_INTEGER+" !important; position: absolute !important; background-color: transparent !important; font-size: unset !important; border-radius: 0% !important; user-select: none !important;";

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

function findInst(v, mon){
	if(!mon){
		let arrChk=global.instances.filter((i)=>{return i.video===v;});
		return (arrChk.length>0)?arrChk[0]:null;
	}else{
		let arrChk=global.monitored.filter((m)=>{return m===v;});
		return (arrChk.length>0)?arrChk[0]:null;
	}
}

function chkVis(i,cvs){
	return (((cvs)?i.cvs:i.sdivs).style['opacity']==='0')?false:true;
}

function positionBar(i,scrl, showPrg){
	
if(scrl && cvs_clkd===false){
i.sdivs.style.cssText=sDivsCSS+'opacity: 0 !important;';
i.faded=true;
i.cvs.style.setProperty('opacity',0,'important');
//i.prgBarTime.style.setProperty('display','none','important');
}

let vrct=absBoundingClientRect(i.video);
let sdrct=absBoundingClientRect(i.bdivs);

i.right=vrct.left+0.001*vrct.width;

if(i.video.tagName==='AUDIO'){
	if(vrct.top<2*sdrct.height+0.102*vrct.height){
		i.sDivsCSS2='top: '+(vrct.bottom+0.102*vrct.height)+'px !important;  left: '+i.right+'px !important;';
	}else{
		i.sDivsCSS2='top: '+(vrct.top-2*sdrct.height-0.102*vrct.height)+'px !important;  left: '+i.right+'px !important;';
	}
}else{
	let vdc=i.video.ownerDocument;
	let vdcf=vdc.fullscreenElement;
	i.top=0.102*vrct.height;
	if(	!(	vdc.fullscreen===true &&
				  !!vdcf &&
				  ( vdcf===i.video ||
				  	( hasAncestor(i.video,vdcf) &&
							( vdcf.clientHeight===i.video.clientHeight ||
							   absBoundingClientRect(vdcf).top===vrct.top )
					   )
					)
			)
		){
			i.top+=vrct.top;
		}
i.sDivsCSS2='top: '+i.top+'px !important;  left: '+i.right+'px !important;';
}


if(scrl && cvs_clkd===false){
	if(!i.entered){
		i.sdivs.style.cssText=sDivsCSS+i.sDivsCSS2+'opacity: 0 !important;';
		i.faded=true;
	}
	if(!i.entered_cvs){
		i.cvs.style.setProperty('opacity',0,'important');
		i.prgBarTime.style.setProperty('display','none','important');
	}
}else{
i.sdivs.style.cssText=sDivsCSS+i.sDivsCSS2;
i.faded=false;
}
sdrct=absBoundingClientRect(i.bdivs);
i.cvs.style.setProperty('width',((sdrct.width>vrct.width)?sdrct.width:vrct.width)+'px','important');
i.cvs.style.setProperty('height',(sdrct.height)+'px','important');
i.cvs.style.setProperty('margin-top','1px','important');

if(cvs_clkd===false && (scrl || !showPrg) && !i.entered_cvs ){
	 	i.cvs.style.setProperty('opacity',0,'important');
		i.prgBarTime.style.setProperty('display','none','important');
}else{
		if(!i.faded){
			if(i.bufEnd || !i.firstBuf){
				drawBuffered(i);
			}
				i.cvs.style.setProperty('opacity',0.64,'important');
		}
}
}
	
function def_retCSS(i,bool, showPrg){

positionBar(i,bool, showPrg);


if(i.ff===1){ // Playback rate adj. activated (button green)
	bdkCol="#007500";
	txCol="white";
	bdkCol2="#00750080";
}else{
	bdkCol="buttonface";
	txCol="black";
	bdkCol2="#f0f0f080";
}


bdkCol_1="buttonface";
txCol_1="black";
bdkCol2_1="#f0f0f080";

let bfStyle="all: initial !important;font-family: system-ui !important;min-width: 42px !important; line-height: 1.91ch !important; transform: translate(0, 0.06ch) !important; padding: 0.05ch 0.25ch 0.05ch 0.25ch !important; visibility:initial !important;  webkit-text-fill-color: black !important; border-width: 2px !important; border-style: outset !important; background-color: "+bdkCol_1+" !important; border-color: "+bdkCol_1+" !important; float: initial !important; text-align-last: center !important; color: "+txCol_1+" !important; font-size: unset !important; border-radius: 0% !important; user-select: none !important;";

let ds_i=" display: initial !important;";
let ds_n=" display: none !important;";

i.skb.style.cssText=bfStyle+ds_i;
i.skf.style.cssText=bfStyle+ds_i;
if(doWB){
	i.tglWB.style.cssText=bfStyle+ds_i;
}

if(!sk_buff){
	i.skb_l.style.cssText=bfStyle+ds_n;
	i.skf_l.style.cssText=bfStyle+ds_n;
}else{
	i.skb_l.style.cssText=bfStyle+ds_i;
	i.skf_l.style.cssText=bfStyle+ds_i;
}

i.butn.style.cssText = "all: initial !important;font-family: system-ui !important;min-width: 75px !important; line-height: 1.91ch !important; transform: translate(0, 0.06ch) !important; padding: 0.05ch 0.25ch 0.05ch 0.25ch !important; display: initial !important; visibility:initial !important;  webkit-text-fill-color: black !important; border-width: 2px !important; border-style: outset !important; background-color: "+bdkCol+" !important; border-color: "+bdkCol+" !important; float: initial !important; text-align-last: right !important; color: "+txCol+" !important; font-size: unset !important; border-radius: 0% !important; user-select: none !important;";
i.clse.style.cssText = "all: initial !important;font-family: system-ui !important;-webkit-text-fill-color: #ececec !important;max-width: max-content !important;line-height: 1.91ch !important;transform: translate(0px, 0.06ch) !important;padding: 0em 0.27em 0em 0.27em !important;display: initial !important;visibility: initial !important;background-color:  #f00000 !important;float: initial !important;text-align-last: left !important;font-size: unset !important;border-radius: 0% !important;user-select: none !important;margin: 0px !important;min-width: 75px !important;border: 0px !important;color: #ececec !important;";

clearTimeout(i.timer3);
i.timer3 = setTimeout(function(){
	if(!i.entered_cvs){
			if(i.entered){
					if(i.bufEnd){
						forcePlaybackRate(i);
						drawBuffered(i);
					}else if(!i.firstBuf){
						drawBuffered(i);
					}
					i.cvs.style.setProperty('opacity',0.64,'important');
			}else if(!i.entered_cvs){
				i.cvs.style.setProperty('opacity',0,'important');
				i.prgBarTime.style.setProperty('display','none','important');
			}
	}
},1250);
	
	clearTimeout(i.timer2);
i.timer2 = setTimeout(function(){
			i.faded=true;
	if(!i.entered){
		if(mbMde || (mbMdeFs && !(document.fullscreen || document.webkitIsFullScreen))){
			let bfStyle2="all: initial !important;font-family: system-ui !important;min-width: 42px  !important; line-height: 1.91ch !important; transform: translate(0, 0.06ch) !important; padding: 0.05ch 0.25ch 0.05ch 0.25ch !important; visibility:initial !important;  webkit-text-fill-color: black !important; border-width: 2px !important; border-style: outset !important; background-color: "+bdkCol2_1+" !important; border-color: #00000000 !important; float: initial !important; text-align-last: center !important; color: "+txCol_1+" !important; font-size: unset !important; border-radius: 0% !important; user-select: none !important;";

i.skb.style.cssText=bfStyle2+ds_i;
i.skf.style.cssText=bfStyle2+ds_i;
if(doWB){
	i.tglWB.style.cssText=bfStyle2+ds_i;
}
if(!sk_buff){
	i.skb_l.style.cssText=bfStyle2+ds_n;
	i.skf_l.style.cssText=bfStyle2+ds_n;
}else{
	i.skb_l.style.cssText=bfStyle2+ds_i;
	i.skf_l.style.cssText=bfStyle2+ds_i;
}

i.butn.style.cssText = "all: initial !important;font-family: system-ui !important;min-width: 75px  !important; line-height: 1.91ch !important; transform: translate(0, 0.06ch) !important; padding: 0.05ch 0.25ch 0.05ch 0.25ch !important; display: initial !important; visibility:initial !important;  webkit-text-fill-color: black !important; border-width: 2px !important; border-style: outset !important; background-color: "+bdkCol2+" !important; border-color: #00000000 !important; float: initial !important; text-align-last: right !important; color: "+txCol+" !important; font-size: unset !important; border-radius: 0% !important; user-select: none !important;";
i.clse.style.cssText ="all: initial !important;font-family: system-ui !important;-webkit-text-fill-color: #ececec !important;max-width: max-content !important;line-height: 1.91ch !important;transform: translate(0px, 0.06ch) !important;padding: 0em 0.27em 0em 0.27em !important;display: initial !important;visibility: initial !important;background-color: rgba(240, 0, 0, 0.5) !important;float: initial !important;text-align-last: left !important;font-size: unset !important;border-radius: 0% !important;user-select: none !important;margin: 0px !important;min-width: 75px !important;border: 0px !important;color: #ececec !important;";

if(cvs_clkd===false && !i.entered_cvs){
	i.cvs.style.setProperty('opacity',0,'important');
	i.prgBarTime.style.setProperty('display','none','important');
}
		}else if (cvs_clkd===false){
				if(!i.entered){
					i.sdivs.style.cssText=sDivsCSS+i.sDivsCSS2+'opacity: 0 !important;';
					i.faded=true;
				}
				if(!i.entered_cvs){
					i.cvs.style.setProperty('opacity',0,'important');
					i.prgBarTime.style.setProperty('display','none','important');
				}

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
	let arrChk=arr.filter((a)=>{return a===el;});
	return (arrChk.length>0)?true:false;
}

function removeEls(d, array) {
    return array.filter((a)=>{return a!==d});
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
			var ctx = i.cvs.getContext('2d', {willReadFrequently: true});
			ctx.globalCompositeOperation = "source-over";
			var canvasWidth = i.cvs.scrollWidth;
			var canvasHeight = i.cvs.scrollHeight;
			
			if(canvasWidth>0 && canvasHeight>0){
				if(i.firstBuf===false){
					i.firstBuf=true;
				}
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
				for (let x=xds; x<=xdt; x++){
					let grn=(xdc!=-1 && x>=xdc && x<=xdt)?true:false;
					if(grn===true){
						for (let y=canvasHeight-1; y>=0; y--){
							setPix(pixels, x, y, 0,171,14, canvasWidth);
						}
					}else{
						for (let y=canvasHeight-1; y>=0; y--){
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
			for (let x=xds; x<=xdt; x++){
				let grn=(xdc!=-1 && x>=xdc && x<=xdt)?true:false;
				if(grn===true){
					for (let y=canvasHeight-1; y>=0; y--){
						setPix(pixels, x, y, 0,171,14, canvasWidth);
					}
				}else{
					for (let y=canvasHeight-1; y>=0; y--){
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
				i.bufEnd=true;
					i.ldd='END';
					forcePlaybackRate(i,noAdj);
			}else{
				i.bufEnd=false;
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
calcSp(i,false);
}else{
i.video.playbackRate=1;
}
}else{
	calcSp(i,true);
}
}
}

function ended_hdl(event) {
let i=findInst(event.target,false);
if(!!i){
if(i.pg_e==1){
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
if(i.video.paused){
def_retCSS(i,false,true);
}
}
}
}

function pointerenter_hdl(event,i) {
	 if(event.buttons==0){
		i.entered=true;
		def_retCSS(i,false,true);
	 }
}

function pointermove_hdl(event) {
let i=findInst(event.target,false);
if(!!i && cvs_clkd===false && justUp===false){
def_retCSS(i,false,false);
}
}

function pointerleave_hdl(event,i) {
	 if(event.buttons==0){
		i.entered=false;
		def_retCSS(i,false,true);
	 }
}

function fsc_hdl(i) {
let fsOn=document.fullscreen || document.webkitIsFullScreen;
if(fsOn){
	i.video.insertAdjacentElement('beforebegin',i.sdivs);
}else{
let anc=getAncestors(i.video, true, true, false, true);
let fpt=anc[anc.length-1];
fpt.insertAdjacentElement('beforebegin', i.sdivs);
}
def_retCSS(i,true,true);
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

function showWB(i) {
	event.stopPropagation();
	if(i.RGB_divs.getAttribute('isShowing')=='false'){
		i.RGB_divs.style.setProperty('display','flex','important');
		i.RGB_divs.setAttribute('isShowing',true);
	}else{
		i.RGB_divs.style.setProperty('display','none','important');
		i.RGB_divs.setAttribute('isShowing',false);
	}
	
}

function colInp_reset(i) {
	//event.preventDefault();
	event.stopPropagation();
	let opt=i.colSel.selectedOptions[0];
	let val=opt.getAttribute('dft');
	i.colInp.value=val;
	opt.setAttribute('curr',val);
	let pst=opt.getAttribute('postText');
	opt.textContent =  opt.getAttribute('nm')+' '+opt.getAttribute('preText')+val+pst;
	opt.title =val+pst.split(')')[0];
	colInp_inp(i,null,true);
}
function colInp_inp(i,b,skp) {
	if(skp!==true){
		//event.preventDefault();
		event.stopPropagation();
		let opt=i.colSel.selectedOptions[0];
		let val;
		if(b!==false){
			val=i.colInp.value;
			opt.setAttribute('curr',val);
		}else{ //sel change
			i.colInp.min= opt.getAttribute('lw');
			i.colInp.max= opt.getAttribute('hi');
			i.colInp.step= opt.getAttribute('stp');
			val= opt.getAttribute('curr');
			i.colInp.value=val;
		}
		let pst=opt.getAttribute('postText');
		opt.textContent =  opt.getAttribute('nm')+' '+opt.getAttribute('preText')+val+pst;
		opt.title =val+pst.split(')')[0];
	}
	if(b!==false){
		
		

		let outp=JSON.parse(WB_defMtx_JSON);
		let rgbC=hex2rgb(i.WB_eydrop.value);
		rgbC=rgbC.map((c)=>{return c/255.0;});
		let mn=(rgbC[0]+rgbC[1]+rgbC[2])/3.0;
		let md=(rgbC.toSorted())[1];
		let mx=Math.max(mn,md);
	
		
		for(let k=0; k<3; k++){ //each output colour
			let rk=rgbC[k];
			if(rk!==0){
				let ncl=mx/rk;
				for(let j=0; j<5; j++){
					outp[k][j]=ncl*WB_defMtx[k][j];
				}
			}else{
				for(let j=0; j<4; j++){
					if(j!==k){
						outp[k][j]=0;
					}else{
						outp[k][j]=1;
					}
				}
				outp[k][4]=1;
			}
		}
		let outp_flatJ=outp.flat().join(',');
		
		
			i.clrMtrx_tag2=`<svg xmlns="http://www.w3.org/2000/svg">
	<filter id="clrMtrx_svg">
		<feColorMatrix type="matrix"
			values="${outp_flatJ}">
		</feColorMatrix>
	</filter>
</svg>`;
					
	i.svg_blob2 = new Blob([i.clrMtrx_tag2], { type: 'image/svg+xml' });
	i.svg_url2 = URL.createObjectURL(i.svg_blob2);

		let flt=[`url('${i.svg_url2}#clrMtrx_svg')`];
		let opts=i.colSel.children;
		for(let j=0, len_j=opts.length;j<len_j; j++ ){
			let opj=opts[j];
			 flt.push(opj.getAttribute('nm')+opj.getAttribute('preText')+opj.getAttribute('curr')+opj.getAttribute('postText'));
		}
		
		i.video.style.setProperty('filter',flt.join(' '),'important');
	}
}

function WB_inp(i,c) {
	if(event.type==='input' || c){
		if(c){
			i.WB_eydrop.value=c;
		}
		i.WB_eydrop_txt.textContent=i.WB_eydrop.value.toLocaleUpperCase();
		colInp_inp(i);
	}else{
		i.video.style.setProperty('filter',`url('${WB_defMtx_blob}#clrMtrx_svg')`,'important');
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

function cl_dbl_clk(i,dbl) {
	
	i.s_vis=chkVis(i,false); //null -> true/false
	i.c_vis=chkVis(i,true);	
	let rectV=absBoundingClientRect(i.cvs);
//event.preventDefault();
let b_pass=true;

 if(event.target===i.cvs){
		event.stopPropagation();
		if(cvs_clk>1){
			cvs_clkd=false;
		}else if(dbl!==true){
			cvs_clkd=true;
		}else{
			cvs_clkd=false;
		}
		i.obscPrg={x: event.pageX, l: rectV.left, w:rectV.width}
		//i.cvs.click();
		cvs_hdl(event,i,4);
		b_pass=false;
}
	
if(b_pass){ //button not clicked directly
	if(event.pageX >= rectV.left && event.pageX <= rectV.right && event.pageY >= rectV.top && event.pageY <= rectV.bottom){
		event.stopPropagation();
		if(cvs_clk>1){
			cvs_clkd=false;
		}else if(dbl!==true){
			cvs_clkd=true;
		}else{
			cvs_clkd=false;
		}
		i.obscPrg={x: event.pageX, l: rectV.left, w:rectV.width}
		//i.cvs.click();
			cvs_hdl(event,i,4);
	}
}
	
}

function cl_clk(i) {
	let t=event.target;
	i.s_vis=chkVis(i,false); //null -> true/false
	i.c_vis=chkVis(i,true);	
	let rectV=absBoundingClientRect(i.cvs);
//event.preventDefault();
event.stopPropagation();
let b_pass=true;
let ct=false;
	if(t===i.clse){
		i.clse.focus();
		b_pass=false;
	}else if(t===i.butn){
		//i.butn.click();
		btclk(i);
		b_pass=false;
	}else if(t===i.skb){
		//i.skb.click();
		sk_bk(i);
		b_pass=false;
	}else if(t===i.skf){
		//i.skf.click();
		sk_fw(i);
		b_pass=false;
	}else if(t===i.cvs){
		b_pass=false;
	}else if(sk_buff){
		if(t===i.skb_l){
			//i.skb_l.click();
			sk_l_bk(i);
			b_pass=false;
		}else if(t===i.skf_l){
			//i.skf_l.click();
			sk_l_fw(i);
			b_pass=false;
		}
	}
	
	if(b_pass){ //button not clicked directly
		
		let rectC=absBoundingClientRect(i.clse);
		let rectB=absBoundingClientRect(i.butn);
		let rectK=absBoundingClientRect(i.skb);
		let rectF=absBoundingClientRect(i.skf);
	
		if(event.pageX >= rectC.left && event.pageX <= rectC.right && event.pageY >= rectC.top && event.pageY <= rectC.bottom){
			i.clse.focus();
			ct=true;
		}else if(event.pageX >= rectB.left && event.pageX <= rectB.right && event.pageY >= rectB.top && event.pageY <= rectB.bottom){
			//i.butn.click();
			btclk(i);
			ct=true;
		}else if(event.pageX >= rectK.left && event.pageX <= rectK.right && event.pageY >= rectK.top && event.pageY <= rectK.bottom){
			//i.skb.click();
			sk_bk(i);
			ct=true;
		}else if(event.pageX >= rectF.left && event.pageX <= rectF.right && event.pageY >= rectF.top && event.pageY <= rectF.bottom){
			//i.skf.click();
			sk_fw(i);
			ct=true;
		}else if(event.pageX >= rectV.left && event.pageX <= rectV.right && event.pageY >= rectV.top && event.pageY <= rectV.bottom){
				ct=true;
		}else if(sk_buff){
			let rectKL=absBoundingClientRect(i.skb_l);
			let rectFL=absBoundingClientRect(i.skf_l);
			if(event.pageX >= rectKL.left && event.pageX <= rectKL.right && event.pageY >= rectKL.top && event.pageY <= rectKL.bottom){
				//i.skb_l.click();
				sk_l_bk(i);
				ct=true;
			}else if(event.pageX >= rectFL.left && event.pageX <= rectFL.right && event.pageY >= rectFL.top && event.pageY <= rectFL.bottom){
				//i.skf_l.click();
				sk_l_fw(i);
				ct=true;
			}
		}
	}
	def_retCSS(i,false,true);
	if (b_pass && !ct && i.clse.matches(':focus')){
		i.clse.blur();
	}
	if((t===i.WB_eydrop_div || t===i.WB_eydrop_txt) && i.cmpWB===false){
		i.cmpWB=true;
		i.oldWB=i.WB_eydrop.value;
		i.WB_eydrop.value='#ffffff';
		i.WB_eydrop.dispatchEvent(new Event('input'));
	}
}

function cl_ptUp(i) {
	let t=event.target;
	cvs_clkd=false;
	if(t!==i.cvs){
		justUp=true;
		i.entered_cvs=false;
		clearTimeout(i.timer3);
		i.timer3 = setTimeout(function(){
			def_retCSS(i,false,false);
			justUp=false;
		},1250);
	}
	if(i.cmpWB===true){
		i.cmpWB=false;
		i.WB_eydrop.value=i.oldWB;
		i.WB_eydrop.dispatchEvent(new Event('input'));
	}
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
			
			if(!(items.cvsClk==0 || typeof items.cvsClk ==='undefined')){
				cvs_clk=parseInt(items.cvsClk);
			}	

			if(!!items.skbcbx && typeof items.skbcbx !=='undefined'){
				sk_buff=items.skbcbx;
			}

			if(typeof(items.vidFilts)!=='undefined'){
				if(items.vidFilts==true){
					doWB=true;
				}
			}
			
			if(typeof(items.custMtx)!=='undefined'){
				if(items.custMtx==true){
					WB_defMtx=[ //original matrix used on videos
						[1.036,-0.0286,0.0005,0,-0.0041],
						[-0.1218,1.2056,-0.0745,0,-0.0003],
						[-0.0147,0.002,1.0219,0,-0.0046],
						[0,0,0,1,0]
					];
				}else{
					WB_defMtx=[ [1,0,0,0,0],[0,1,0,0,0],[0,0,1,0,0],[0,0,0,1,0] ];
				}
				WB_defMtx_JSON=JSON.stringify(WB_defMtx);
				WB_defMtx_flat=WB_defMtx.flat().join(',');
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
			var timer_tm=null;
		const observer = new MutationObserver((mutations) =>
		{
			if(timer){
				clearTimeout(timer);
				if(performance.now()-timer_tm>=1350){
					checker();
					timer_tm=performance.now();
				}
			}
			
			timer = setTimeout(() =>
			{
				checker();
				timer_tm=performance.now();
			}, 150);
			
			if(timer_tm ===null){
				timer_tm=performance.now();
			}
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
let bdivs = document.createElement("div");
bdivs.style.cssText="all: initial !important;font-family: system-ui !important;padding: 0px !important; border-bottom-width: 0px !important; border-left-width: 0px !important; border-right-width: 0px !important; border-top-width: 0px!important; line-height: 0px !important; margin: 0px !important; max-width: max-content !important; user-select: none !important; display: flex !important; flex-flow: row wrap !important; justify-content: flex-start !important; align-items: stretch !important; align-content: flex-start !important; gap: 0px 0px !important;";
let tglWB,RGB_divs,WB_eydrop,WB_eydrop_div,WB_eydrop_txt,colSel,colInp;
if(doWB){
	tglWB = document.createElement("button");
	tglWB.innerHTML='&#x1F3A8;';
	tglWB.title='Toggle video filters bar';
	RGB_divs = document.createElement("div");
	RGB_divs.style.cssText="all: initial !important;font-family: system-ui !important;padding: 0px !important; border-bottom-width: 0px !important; border-left-width: 0px !important; border-right-width: 0px !important; border-top-width: 0px!important; line-height: 0px !important; margin: 0px !important;user-select: none !important;user-select: none !important; display: none !important; flex-flow: row !important; justify-content: flex-start !important; align-items: stretch !important; align-content: flex-start !important; gap: 0px 0px !important;";
	RGB_divs.setAttribute('isShowing',false);


	colSel= document.createElement("select");
	colSel.style.cssText="all: initial !important; align-items: center !important; background: buttonface !important; appearance: auto !important;";

	let setts=[
		['hue-rotate',0,360,1,0],
		['saturate',0,5,0.001,1],
		['contrast',0,10,0.001,1],
		['brightness',0,10,0.001,1],
		['invert',0,1,1,0],
	];
	setts.forEach(sett => {
		// Create option element
		const opt = document.createElement('option');
		opt.setAttribute('nm',sett[0]);
		opt.setAttribute('lw',sett[1]);
		opt.setAttribute('hi',sett[2]);
		opt.setAttribute('stp',sett[3]);
		opt.setAttribute('curr',sett[4]);
		opt.setAttribute('dft',sett[4]);
		let preTxt='(';
		opt.setAttribute('preText',preTxt);
		let isDeg=(sett[0]==='hue-rotate')?'deg)':')';
		opt.setAttribute('postText',isDeg);
		opt.style.cssText='color: black;';
		opt.textContent =sett[0]+' '+preTxt+sett[4]+isDeg;
		colSel.appendChild(opt);	
	  });
	colInp= document.createElement("input");
	colInp.type="range";
	colInp.min=0;
	colInp.max=360;
	colInp.value=0;
	colInp.title= 'Double-click to reset to default';
	colInp.style.cssText="all: initial !important;appearance: auto !important;width: -webkit-fill-available !important;vertical-align: middle !important;";
	RGB_divs.insertAdjacentHTML('beforeend',`<div><input class="col" type="color" style="width: 4.808ch !important; background-color: #000000 !important; border: #000000 !important;" id="vis" value="#ffffff">#FFFFFF</input></div>`);
	let chn=RGB_divs.childNodes;
	WB_eydrop_div=chn[0];
	WB_eydrop_div.title='White balance - Double-click to reset to default - Click and hold down to compare with original';
	WB_eydrop_div.style.cssText="all: initial !important;display: flex !important;align-items: center !important;background: #000000 !important;width: fit-content !important;padding-right: 0.5ch !important;";
	chn=WB_eydrop_div.childNodes;
	WB_eydrop=chn[0];
	WB_eydrop_txt=chn[1];
	RGB_divs.appendChild(colSel);
	RGB_divs.appendChild(colInp);
}
let clse = document.createElement("input");
let skb_l = document.createElement("button");
let skf_l = document.createElement("button");
let prgBarTime = document.createElement("div");
prgBarTime.style.cssText="all: initial !important;font-family: system-ui !important;text-align-last: left !important; min-width: 4.84ch !important; line-height: 1.91ch !important; transform: translate(0px, 0.06ch) !important;padding: 0.05ch 0.25ch 0.05ch 0.44ch !important;visibility: initial !important;border-width: 2px !important;border-style: outset !important;background-color: rgb(43 43 43 / 50%) !important;border-color: rgba(0, 0, 0, 0) !important;float: initial !important;color: white !important;font-size: unset !important;border-radius: 0% !important;user-select: none !important;";
let cvs = document.createElement("canvas");

clse.type = "number";
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

bdivs.appendChild(skb);
bdivs.appendChild(skf);
bdivs.appendChild(butn);
bdivs.appendChild(clse);
bdivs.appendChild(skb_l);
bdivs.appendChild(skf_l);
if(doWB){
	bdivs.appendChild(tglWB);
}
bdivs.appendChild(prgBarTime);
sdivs.appendChild(bdivs);
sdivs.appendChild(document.createElement("br"));
if(doWB){
	sdivs.appendChild(RGB_divs);
}
sdivs.appendChild(cvs);




cvs.style.setProperty('background','#167ac6','important');
cvs.style.setProperty('user-select','none','important');
cvs.style.setProperty('visibility','visible','important');
cvs.style.setProperty('float','initial','important');
cvs.style.setProperty('border-radius','0%','important');


if(document.fullscreen || document.webkitIsFullScreen){
	i.video.insertAdjacentElement('beforebegin',i.sdivs);
}else{
	let anc=getAncestors(obj.video, true, true, false, true);
	let fpt=anc[anc.length-1];
	fpt.insertAdjacentElement('beforebegin', sdivs);
}

obj.skb_l=skb_l;
obj.skb=skb;
obj.skf=skf;
obj.skf_l=skf_l;
obj.cvs=cvs;
obj.butn=butn;
obj.clse=clse;
obj.prgBarTime=prgBarTime;
obj.bdivs=bdivs;
obj.sdivs=sdivs;
obj.cmu_sk=0;

if(doWB){
	obj.cmpWB=false;
	obj.oldWB='#ffffff';
	obj.clrMtrx_tag2={};
	obj.svg_blob2={};
	obj.svg_url2='';
	obj.RGB_divs=RGB_divs;
	obj.WB_eydrop=WB_eydrop;
	obj.WB_eydrop_txt=WB_eydrop_txt;
	obj.WB_eydrop_div=WB_eydrop_div;
	obj.colSel=colSel;
	obj.colInp=colInp;
	obj.tglWB=tglWB;
}

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
obj.wh_e=0;
//obj.clk_e=0;
obj.timer2;
obj.entered=false;
obj.entered_cvs=false;
obj.faded=false;
obj.top=0;
obj.right=0;
obj.sDivsCSS2="";
obj.sclr=false;
obj.bufEnd=false;
obj.firstBuf=false;
obj.s_vis=null;
obj.c_vis=null;
obj.obscPrg={};
global.instances.push(obj);

def_retCSS(obj, true, true);

function wdw(event){
	if(!obj.sclr){
		obj.sclr=true;
		let scl=true;
		let rectV=absBoundingClientRect(obj.cvs);
		//event.preventDefault();
		let b_pass=true;

		 if(event.target===obj.cvs){
				scl=false;
				b_pass=false;
		}
		
		if(b_pass){ //button not clicked directly
			if(event.pageX >= rectV.left && event.pageX <= rectV.right && event.pageY >= rectV.top && event.pageY <= rectV.bottom){
				scl=false;
			}
		}
		
		def_retCSS(obj,scl,false);
		obj.sclr=false;
	}
}

window.addEventListener("wheel", (event) => {
	 wdw(event);
}, true);

window.addEventListener("wheel", (event) => {
	wdw(event);
}, false);

document.addEventListener("scroll", (event) => {
	wdw(event);
}, true);
document.addEventListener("scroll", (event) => {
	wdw(event);
}, false);


/*skb.addEventListener("click", sk_bk(obj));	
skf.addEventListener("click", sk_fw(obj));	
butn.addEventListener("click", btclk(obj));	
skb_l.addEventListener("click", sk_l_bk(obj));	
skf_l.addEventListener("click", sk_l_fw(obj));	
cvs.addEventListener("click", (evt) =>cvs_hdl(evt,obj,0));*/
window.addEventListener("pointermove", (evt) =>cvs_hdl(evt,obj,0));
cvs.addEventListener("pointermove", (evt) =>cvs_hdl(evt,obj,1));
cvs.addEventListener("pointerenter", (evt) =>cvs_hdl(evt,obj,2));
cvs.addEventListener("pointerleave", (evt) =>cvs_hdl(evt,obj,3));
cvs.addEventListener("wheel", (evt) =>cvs_whl(evt,obj));
bdivs.addEventListener('wheel',(evt) => cl_whl(evt,obj));
vid.addEventListener('ratechange',ratechange_hdl);

clse.addEventListener('keyup',() => cl_inp(obj));
clse.addEventListener('keydown',() => cl_inp(obj));
clse.addEventListener('change',() => cl_inp(obj));
clse.addEventListener('change',() => cl_inp(obj));

clse.addEventListener('focus',() => cl_focus(obj));

if(doWB){
	colInp.addEventListener('dblclick',() => colInp_reset(obj));
	colInp.addEventListener('input',() => colInp_inp(obj));
	colSel.addEventListener('input',() => colInp_inp(obj,false));
	WB_eydrop.addEventListener('click',() => WB_inp(obj));
	WB_eydrop_div.addEventListener('dblclick',() => WB_inp(obj,'#ffffff'));
	WB_eydrop.addEventListener('input',() => WB_inp(obj));
	tglWB.addEventListener('click',() => showWB(obj));
	RGB_divs.addEventListener('pointerenter',(evt) => pointerenter_hdl(evt,obj));
	RGB_divs.addEventListener('pointerleave',(evt) => pointerleave_hdl(evt,obj));
}

bdivs.addEventListener('pointerenter',(evt) => pointerenter_hdl(evt,obj));
bdivs.addEventListener('pointerleave',(evt) => pointerleave_hdl(evt,obj));

if(cvs_clk==0){
	window.addEventListener('pointerdown',() => cl_dbl_clk(obj));
}else if(cvs_clk==1){
	window.addEventListener('dblclick',() => cl_dbl_clk(obj,true));
}

window.addEventListener('pointerdown',() => cl_clk(obj));
window.addEventListener('pointerup',() => cl_ptUp(obj));
document.addEventListener('fullscreenchange',() => fsc_hdl(obj));
document.addEventListener('webkitfullscreenchange',() => fsc_hdl(obj));
vid.addEventListener('pointermove',pointermove_hdl);
vid.addEventListener('seeked',seeked_hdl);
vid.addEventListener('seeking',seeking_hdl);
vid.addEventListener('play',play_hdl);
vid.addEventListener('progress',progress_hdl);
vid.addEventListener('waiting',waiting_hdl);
vid.addEventListener('ended',ended_hdl);
}

function btclk(i) {
			if(!!event && typeof event !=='undefined'){
			event.preventDefault();
			event.stopPropagation();
			if(i.ff==-1){
				chgFlgs(i,true);
				let vN=(Number.isNaN(i.clse.valueAsNumber))?1:i.clse.valueAsNumber;
				i.video.playbackRate=vN;	
				i.ff=1;
			}else if (i.ff==0){
				chgFlgs(i,true);
				let vN=(Number.isNaN(i.clse.valueAsNumber))?1:i.clse.valueAsNumber;
				i.video.playbackRate=vN;
				i.ff=1;
			}else{
				chgFlgs(i,false);
				i.video.playbackRate=1;
				i.butn.innerText="1x";
				i.ff=0;
				i.lddArr=[];
			}
			def_retCSS(i,false,true);
			}
}

function sk_bk(i, bypss){
					let bps=(typeof bypss!=='undefined' && bypss)?true:false;
					let s_pass=false;
					if(!bps){
						if(i.s_vis==null){
							s_pass=chkVis(i,false);
						}else if(i.s_vis==true){
							i.s_vis=null;
							s_pass=true;
						}else{
							i.s_vis=null;
						}
					}
				if(s_pass || bps){
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
			}
}

function sk_fw(i, bypss){
			let bps=(typeof bypss!=='undefined' && bypss)?true:false;
					let s_pass=false;
					if(!bps){
						if(i.s_vis==null){
							s_pass=chkVis(i,false);
						}else if(i.s_vis==true){
							i.s_vis=null;
							s_pass=true;
						}else{
							i.s_vis=null;
						}
					}
		if(s_pass || bps){
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
	}
}

function sk_l_bk(i){
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

function sk_l_fw(i){
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

function cvs_hdl(e,i,m){
	let outsideScrub=(m==0 && cvs_clkd===true)?true:false;
	if(m==3 && cvs_clkd===false){
		i.prgBarTime.style.setProperty('display','none','important');
		i.entered_cvs=false;
		clearTimeout(i.timer3);
		i.timer3 = setTimeout(function(){
			if(!i.entered_cvs){
				if(i.entered && !i.faded){
						if(i.bufEnd){
							forcePlaybackRate(i);
							drawBuffered(i);
						}else if(!i.firstBuf){
							drawBuffered(i);
						}
						i.cvs.style.setProperty('opacity',0.64,'important');
					}else if(cvs_clkd===false && !i.entered_cvs){
						i.cvs.style.setProperty('opacity',0,'important');
					}
					
			}
		},1250);
	}else if(m==3){
		i.entered_cvs=false;
		i.prgBarTime.style.setProperty('display','none','important');
	}else{
		if(  ( m==1 || outsideScrub===true ) || m==2 || (m==4) ){
			i.entered_cvs=true;
			if(!i.faded){
					if(i.bufEnd){
						forcePlaybackRate(i);
						drawBuffered(i);
					}else if(!i.firstBuf){
						drawBuffered(i);
					}
					if(m==2){
						i.cvs.style.setProperty('opacity',0.84,'important');
					}else if(cvs_clkd===false){
						i.cvs.style.setProperty('opacity',0.64,'important');
					}
			}
					clearTimeout(i.timer3);
		i.timer3 = setTimeout(function(){
						if((i.entered || i.entered_cvs) && !i.faded){
								if(i.bufEnd){
									forcePlaybackRate(i);
									drawBuffered(i);
								}else if(!i.firstBuf){
									drawBuffered(i);
								}
								i.cvs.style.setProperty('opacity',0.64,'important');
							}else if(cvs_clkd===false && !i.entered_cvs){
								i.cvs.style.setProperty('opacity',0,'important');
								i.prgBarTime.style.setProperty('display','none','important');
							}
		},3000);
		}
	let s=parseFloat(i.cvs.getAttribute('start'));
	let t=parseFloat(i.cvs.getAttribute('end'));
	let l;
	
	if(outsideScrub===true){
		let rectV=absBoundingClientRect(i.cvs);
		i.obscPrg={x: e.pageX, l: rectV.left, w:rectV.width}
		l=(i.obscPrg.x-i.obscPrg.l)/i.obscPrg.w;
		i.obscPrg={};
	}else if(Object.keys(i.obscPrg).length>0){
		l=(i.obscPrg.x-i.obscPrg.l)/i.obscPrg.w;
		i.obscPrg={};
	}else if(m==1){
		l=e.offsetX/e.target.scrollWidth;
	}
	
	let time=(1-l)*s+l*t;
	let timeFmt=bf_s_hmmss(time,true);
	let vt=(!isNaN(time) && isFinite(time))?true:false;
	if(vt){
		i.cvs.style.setProperty('opacity',0.64,'important');
		//i.cvs.title=timeFmt;
		i.prgBarTime.innerText=timeFmt;
		i.prgBarTime.style.setProperty('display','block','important');
	}
	
	if(( outsideScrub===true) || (m>=1 && m<=3 && e.buttons!=0 && cvs_clk<1 ) || (m==4)){
					let c_pass=false;
					if(i.c_vis==null){					
						c_pass=chkVis(i,true);
					}else if(i.c_vis==true){
						i.c_vis=null;
						c_pass=true;
					}else{
						i.c_vis=null;
					}
			if( (c_pass || outsideScrub===true) && vt){
				i.cvs.style.setProperty('opacity',0.64,'important');
				i.video.currentTime=time;
				i.prgBarTime.innerText=timeFmt;
				i.prgBarTime.style.setProperty('display','block','important');
			}
		}
	}
}

function cvs_whl(e,i){
	e.preventDefault();
	e.stopPropagation();
	if (e.deltaY < 0)
	{
		//i.skf.click();
		sk_fw(i,true);
	}
	if (e.deltaY > 0)
	{
		//i.skb.click();
		sk_bk(i,true);
	}
}

function checker(){
			let DOMvids=getMatchingNodesShadow(document,['VIDEO','AUDIO'],true,false);

			for (let j=0; j<DOMvids.length; j++){
				let found=(global.monitored.includes(DOMvids[j]))?true:false;
				let instVid=global.instances.map((i)=>{return i.video;});
				
				if(!found){
					let found=(instVid.includes(DOMvids[j]))?true:false;
				}
		
				if(!found){
					global.monitored.push(DOMvids[j]);
					DOMvids[j].addEventListener('loadeddata',progress_hdl_chk);
					DOMvids[j].addEventListener('progress',progress_hdl_chk);
				}
				
				found=(instVid.includes(DOMvids[j]))?true:false;
				
				if(!found){
					 if(eligVid(DOMvids[j])){
						 if(global.monitored.includes(DOMvids[j])){
							 DOMvids[j].removeEventListener('loadeddata',progress_hdl_chk);
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
						i.video.removeEventListener('ended',ended_hdl);
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
					elRemover(inst.bdivs);
					elRemover(inst.sdivs);
					global.instances=removeEls(inst,global.instances);
					}
				}
			}
	}

restore_options();