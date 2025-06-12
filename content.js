var insts=[];
var tempInsts=[];
var activeInsts=[];
var ldmv=[];
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
const wb_filt=[" filter: saturate(3.15) contrast(1.74) !important"," filter: saturate(3.12) contrast(1.56) brightness(0.75) !important;"];

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

function showBtns(i){
	let bdkCol,txCol,bdkCol2,bdc;
	if(i.ff===1){ // Playback rate adj. activated (button green)
	bdkCol=["buttonface","#007500"];
	txCol=["black","white"];
	bdkCol2="#00750080";
	bdc="#00750080";
}else{
	bdkCol=["buttonface","buttonface"];
	txCol=["black","black"];
	bdkCol2="#f0f0f080";
	bdc='buttonface';
}

let bfStyle="all: initial !important;font-family: system-ui !important;min-width: 42px !important; line-height: 1.91ch !important; transform: translate(0, 0.06ch) !important; padding: 0.05ch 0.25ch 0.05ch 0.25ch !important; visibility:initial !important;  webkit-text-fill-color: black !important; border-width: 2px !important; border-style: outset !important; background-color: "+bdkCol[0]+" !important; border-color: buttonface !important; float: initial !important; text-align-last: center !important; color: "+txCol[0]+" !important; font-size: unset !important; border-radius: 0% !important; user-select: none !important;";
let bfStyle_plp="all: initial !important;font-family: Segoe UI Symbol !important;min-width: 42px !important; line-height: 1.91ch !important; transform: translate(0, 0.06ch) !important; padding: 0ch 0ch 0.188ch 0ch !important; visibility:initial !important;  webkit-text-fill-color: black !important; border-width: 2px !important; border-style: outset !important; background-color: "+bdkCol[0]+" !important; border-color: buttonface !important; float: initial !important; text-align-last: center !important; color: "+txCol[0]+" !important; font-size: unset !important; border-radius: 0% !important; user-select: none !important;";

let ds_i=" display: initial !important;";
let ds_n=" display: none !important;";

i.plp.style.cssText=bfStyle_plp+ds_i;
i.skb.style.cssText=bfStyle+ds_i;
i.skf.style.cssText=bfStyle+ds_i;
if(doWB){
	i.tglWB.style.cssText=bfStyle+ds_i+wb_filt[1]+'background: #8a8a8a !important;';
}

if(!sk_buff){
	i.skb_l.style.cssText=bfStyle+ds_n;
	i.skf_l.style.cssText=bfStyle+ds_n;
}else{
	i.skb_l.style.cssText=bfStyle+ds_i;
	i.skf_l.style.cssText=bfStyle+ds_i;
}

i.butn.style.cssText = "all: initial !important;font-family: system-ui !important;min-width: 75px !important; line-height: 1.91ch !important; transform: translate(0, 0.06ch) !important; padding: 0.05ch 0.25ch 0.05ch 0.25ch !important; display: initial !important; visibility:initial !important;  webkit-text-fill-color: black !important; border-width: 2px !important; border-style: outset !important; background-color: "+bdkCol[1]+" !important; border-color: "+bdc+" !important; float: initial !important; text-align-last: right !important; color: "+txCol[1]+" !important; font-size: unset !important; border-radius: 0% !important; user-select: none !important;";
i.clse.style.cssText = "all: initial !important;font-family: system-ui !important;-webkit-text-fill-color: #ececec !important;max-width: max-content !important;line-height: 1.91ch !important;transform: translate(0px, 0.06ch) !important;padding: 0em 0.27em 0em 0.27em !important;display: initial !important;visibility: initial !important;background-color:  #f00000 !important;float: initial !important;text-align-last: left !important;font-size: unset !important;border-radius: 0% !important;user-select: none !important;margin: 0px !important;min-width: 75px !important;border: 0px !important;color: #ececec !important;";
i.faded=false;
i.fadedBtns=false;
}

function fadeBtns(i){
	let bdkCol,txCol,bdkCol2,bdc;


	if(i.ff===1){ // Playback rate adj. activated (button green)
	bdkCol=["#f0f0f080","#00750080"];
	txCol=["black","white"];
	bdc=["#007500","#00750080"];
}else{
	bdkCol=["#f0f0f080","#f0f0f080"];
	txCol=["black","black"];
	bdc=["buttonface",'transparent'];
}
	
	let ds_i=" display: initial !important;";
	let ds_n=" display: none !important;";
	let bfStyle2="all: initial !important;font-family: system-ui !important;min-width: 42px  !important; line-height: 1.91ch !important; transform: translate(0, 0.06ch) !important; padding: 0.05ch 0.25ch 0.05ch 0.25ch !important; visibility:initial !important;  webkit-text-fill-color: black !important; border-width: 2px !important; border-style: outset !important; background-color: "+bdkCol[0]+" !important; border-color: #00000000 !important; float: initial !important; text-align-last: center !important; color: "+txCol[0]+" !important; font-size: unset !important; border-radius: 0% !important; user-select: none !important;";
	let bfStyle2_plp="all: initial !important;font-family: Segoe UI Symbol !important;min-width: 42px  !important; line-height: 1.91ch !important; transform: translate(0, 0.06ch) !important; padding: 0ch 0ch 0.188ch 0ch !important; visibility:initial !important;  webkit-text-fill-color: black !important; border-width: 2px !important; border-style: outset !important; background-color: "+bdkCol[0]+" !important; border-color: #00000000 !important; float: initial !important; text-align-last: center !important; color: "+txCol[0]+" !important; font-size: unset !important; border-radius: 0% !important; user-select: none !important;";

	i.plp.style.cssText=bfStyle2_plp+ds_i;
	i.skb.style.cssText=bfStyle2+ds_i;
	i.skf.style.cssText=bfStyle2+ds_i;
	if(doWB){
		i.tglWB.style.cssText=bfStyle2+ds_i+wb_filt[0]+'background: #8a8a8a80 !important;';
	}
	if(!sk_buff){
		i.skb_l.style.cssText=bfStyle2+ds_n;
		i.skf_l.style.cssText=bfStyle2+ds_n;
	}else{
		i.skb_l.style.cssText=bfStyle2+ds_i;
		i.skf_l.style.cssText=bfStyle2+ds_i;
	}

	i.butn.style.cssText = "all: initial !important;font-family: system-ui !important;min-width: 75px  !important; line-height: 1.91ch !important; transform: translate(0, 0.06ch) !important; padding: 0.05ch 0.25ch 0.05ch 0.25ch !important; display: initial !important; visibility:initial !important;  webkit-text-fill-color: black !important; border-width: 2px !important; border-style: outset !important; background-color: "+bdkCol[1]+" !important; border-color: "+bdc[1]+" !important; float: initial !important; text-align-last: right !important; color: "+txCol[1]+" !important; font-size: unset !important; border-radius: 0% !important; user-select: none !important;";
	i.clse.style.cssText ="all: initial !important;font-family: system-ui !important;-webkit-text-fill-color: #ececec !important;max-width: max-content !important;line-height: 1.91ch !important;transform: translate(0px, 0.06ch) !important;padding: 0em 0.27em 0em 0.27em !important;display: initial !important;visibility: initial !important;background-color: rgba(240, 0, 0, 0.5) !important;float: initial !important;text-align-last: left !important;font-size: unset !important;border-radius: 0% !important;user-select: none !important;margin: 0px !important;min-width: 75px !important;border: 0px !important;color: #ececec !important;";
	i.fadedBtns=true;
	i.fadedBtnsTime=true;
	i.faded=true;
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

function getScreenWidth(mx){
	let w=[
					//document?.documentElement?.scrollWidth,
					//document?.body?.parentNode?.scrollWidth,
					//document?.body?.scrollWidth,
					//document?.head?.scrollWidth,
					//window.screen.availWidth,
					//window.screen.width,
					document?.documentElement?.clientWidth,
					document?.body?.parentNode?.clientWidth,
					document?.body?.clientWidth,
					document?.head?.clientWidth
				].filter( (d)=>{return d>0} );
				
		if(w.length>0){
				if(mx){	
					return Math.max(...w);
				}else{
					return Math.min(...w);
				}
			}else{
				return 0;
			}
}

function getScreenHeight(mx){
	let w=[
					//document?.documentElement?.scrollHeight,
					//document?.body?.parentNode?.scrollHeight,
					//document?.body?.scrollHeight,
					//document?.head?.scrollHeight,
					//window.screen.availHeight,
					//window.screen.Height,
					document?.documentElement?.clientHeight,
					document?.body?.parentNode?.clientHeight,
					document?.body?.clientHeight,
					document?.head?.clientHeight
				].filter( (d)=>{return d>0} );
				
		if(w.length>0){
				if(mx){	
					return Math.max(...w);
				}else{
					return Math.min(...w);
				}
			}else{
				return 0;
			}
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

	r.left_raw=rct.left;
	r.right_raw=rct.right;
	r.top_raw=rct.top;
	r.bottom_raw=rct.left;
	
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

function findInst(v){
	for(let i=0, len_i=insts.length; i<len_i; ++i){
		let inst=insts[i];
		if(inst.video===v){
			return inst;
		}
	}
	return null;
}

function chkVisTime(i){
	return (i.prgBarTime.style['display']==='none')?false:true;
}

function chkVis(i,cvs){
	return (((cvs)?i.cvs:i.sdivs).style['opacity']==='0')?false:true;
}

function positionBar(i,scrl, showPrg,onlyReloc){
let ftr_css=false;
if(scrl && cvs_clkd===false && onlyReloc!==true){
i.sdivs.style.cssText=sDivsCSS+'opacity: 0 !important;';
ftr_css=true;
i.faded=true;
i.cvs.style.setProperty('opacity',0,'important');
//i.prgBarTime.style.setProperty('display','none','important');
}

let vrct=absBoundingClientRect(i.video);

let sdrct;
let wg=0.001*vrct.width;
let sdp=i.sdivs.parentElement;
let ancUndef=(sdp===null || typeof(sdp)==='undefined' || sdp===document.body || sdp===document.head || sdp===document.documentElement)?true:false;
let ancR=(ancUndef===true)?{left:0,top:0}:absBoundingClientRect(sdp);
let vdc=i.video.ownerDocument;
let vdcf=vdc.fullscreenElement;
let fsa=hasAncestor(i.video,vdcf);
if( (vdc.fullscreen===true || ( vdcf===i.video || fsa===true ) ) && ancUndef===false){
	ancR.left=ancR.left_raw;
	ancR.top=ancR.top_raw;
}
i.left=vrct.left+wg-ancR.left;
vrct.vid_width=vrct.width-2*wg;

let forcedTR=( vrct.top_raw===0 && vrct.left_raw===0 && vrct.height===0 && vrct.width===0 )?true:false; //if true, place in middle
let ftp,flf;

if(forcedTR===true){
	if( ftr_css===false ){
		i.sdivs.style.cssText=sDivsCSS+'opacity: 0 !important;';
	}
	sdrct=absBoundingClientRect(i.bdivs);
	ftp=vrct.top+getScreenHeight(true)*0.5 - sdrct.height;
	flf=vrct.left+getScreenWidth(false)*0.5 - sdrct.width*0.5;
}else{
	sdrct=absBoundingClientRect(i.bdivs);
}

if(i.video.tagName==='AUDIO'){
	if(forcedTR===true){
		i.sDivsCSS2='top: '+ftp+'px !important;  left: '+flf+'px !important;';
	}else if(vrct.top<2*sdrct.height+0.102*vrct.height){
		i.sDivsCSS2='top: '+(vrct.bottom+0.102*vrct.height-ancR.top)+'px !important;  left: '+(i.left-ancR.left)+'px !important;';
	}else{
		i.sDivsCSS2='top: '+(vrct.top-2*sdrct.height-0.102*vrct.height-ancR.top)+'px !important;  left: '+(i.left-ancR.left)+'px !important;';
	}
}else{
	
	i.top=0.102*vrct.height-ancR.top;
	if(forcedTR===true){
		i.top=ftp-ancR.top;
		i.left=flf-ancR.left;
	}else if(	!(	vdc.fullscreen===true &&
				  !!vdcf &&
				  ( vdcf===i.video ||
				  	(  fsa===true &&
							( vdcf.clientHeight===i.video.clientHeight ||
							   absBoundingClientRect(vdcf).top===vrct.top )
					   )
					)
			)
		){
			vrct.centre_y=vrct.top+vrct.height*0.5;
			let wScl= i.video.videoWidth===0 ? 1 : vrct.width/i.video.videoWidth;
			let hScld=wScl*i.video.videoHeight;
			let hScl=i.video.videoHeight===0 ? 1 : vrct.height/i.video.videoHeight;
			let wScld=hScl*i.video.videoWidth; 
			let hlf_h=0.5*((wScl<=hScl)?hScld:vrct.height);
			vrct.vid_top=vrct.centre_y-hlf_h;
			vrct.vid_bottom=vrct.centre_y+hlf_h;
			vrct.vid_height=vrct.vid_bottom-vrct.vid_top;
			let hlf_w=0.5*((wScl<=hScl)?vrct.width:wScld);
			vrct.centre_x=vrct.left+vrct.width*0.5;
			vrct.vid_left=vrct.centre_x-hlf_w;
			vrct.vid_right=vrct.centre_x+hlf_w;
			vrct.vid_width=vrct.vid_right-vrct.vid_left;
			wg=0.001*vrct.vid_width;
			vrct.vid_width-=2*wg;
			i.left=vrct.vid_left+wg-ancR.left;
			i.top=vrct.vid_top+0.102*vrct.vid_height-ancR.top;
		}
i.sDivsCSS2='top: '+i.top+'px !important;  left: '+i.left+'px !important;';
}

if(onlyReloc===true){
    i.sdivs.style.cssText=sDivsCSS+i.sDivsCSS2;
    drawBuffered(i);
    return;
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

let cvsChg=false;
let ncw=(sdrct.width>vrct.vid_width)?sdrct.width:vrct.vid_width;
ncw=Math.floor(ncw);
let nch=Math.floor(i.skb.getBoundingClientRect().height);

if(ncw!==i.cvs.width){
	i.cvs.width=ncw;
	cvsChg=true;
}

if(nch!==i.cvs.height){
	i.cvs.height=nch;
	cvsChg=true;
}

if(cvsChg===true){
	drawBuffered(i);
}

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

	if((i.fadedBtnsTime===false || i.entered===false) && (cvs_clkd===false && justUp===false)){
		showBtns(i);
}else{

	let bdc,bck,txCol;
	if(i.ff===1){ // Playback rate adj. activated (button green)
	if(i.fadedBtns){
		txCol="white";
		bdc="#00750080";
		bck="#00750080";
	}else{
		txCol="white";
		bdc="#007500";
		bck="#007500";
	}
}else{
	txCol="black";
	if(i.fadedBtns){
		bdc="transparent";
		bck="#f0f0f080";
	}else{
		bdc="buttonface";
		bck="buttonface";
	}
}

i.butn.style.cssText = "all: initial !important;font-family: system-ui !important;min-width: 75px !important; line-height: 1.91ch !important; transform: translate(0, 0.06ch) !important; padding: 0.05ch 0.25ch 0.05ch 0.25ch !important; display: initial !important; visibility:initial !important;  webkit-text-fill-color: black !important; border-width: 2px !important; border-style: outset !important; background-color: "+bck+" !important; border-color: "+bdc+" !important; float: initial !important; text-align-last: right !important; color: "+txCol+" !important; font-size: unset !important; border-radius: 0% !important; user-select: none !important;";
}

	if(justUp===true && cvs_clkd===false){
		i.fadedBtnsTime=false;
		showBtns(i);
	}
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
	let visTime=chkVisTime(i);
	if(!i.entered /*|| visTime===true*/){
		if(/*visTime===true ||*/ mbMde || (mbMdeFs && !(document.fullscreen || document.webkitIsFullScreen))){
			fadeBtns(i);
if(cvs_clkd===false && !i.entered_cvs && visTime===false){
	i.cvs.style.setProperty('opacity',0,'important');
	i.prgBarTime.style.setProperty('display','none','important');
}
		}else if (cvs_clkd===false){
				if(!i.entered && visTime===false){
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
	let anc=getAncestors(vid, false, false, true, false);
	let fnd=false;
	let dEl=document.documentElement;
	for(let i=0, len=anc.length; i<len; ++i){
		if(anc[i]===dEl){
			fnd=true;
			break;
		}
	}
	if( (fnd===true) && (get_src(vid)!=='') && (vid.readyState > 0) ){
		return [fnd,true];
	}else{
		return [fnd,false];
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
	try{
		el.parentNode.removeChild(el);
	}catch(e){;}
    try{
        el.remove();
	}catch(e){;}
}

function setPix(pixels, x, y, r, g, b, width) {
    var index = 4 * (x + y * width);
    pixels[index] = r;
    pixels[index+1] = g;
    pixels[index+2] = b;
    pixels[index+3] =255;
}

function drawBuffered(i){
	let len=i.video.buffered.length;
	if(len>0){
			let ctx = i.cvs.getContext('2d', {willReadFrequently: true});
			ctx.globalCompositeOperation = "source-over";
			let canvasWidth = i.cvs.width;
			let canvasHeight = i.cvs.height;
			
		if(canvasWidth>0 && canvasHeight>0){
				let canvasWidth_1 = canvasWidth-1;
				if(i.firstBuf===false){
					i.firstBuf=true;
				}
                ctx.clearRect(0, 0, canvasWidth, canvasHeight);
				let iData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
				let pixels = iData.data;
				let dur=i.video.duration;
	if(isFinite(dur)){
		i.cvs.setAttribute('start', 0);
		i.cvs.setAttribute('end', dur);
			for (let k=len-1; k>=0; --k){
				let t_i=i.video.buffered.end(k);
				let s_i=i.video.buffered.start(k);
				let prp=canvasWidth_1/dur;
				let xds=Math.ceil(s_i*prp);
				let xdt=Math.floor(t_i*prp);
				let c_i=i.video.currentTime;
				let xdc=(c_i>=s_i && c_i<=t_i)?Math.ceil(c_i*prp):-1;
				for (let x=xds; x<=xdt; ++x){
					if(x===xdc){
						for (let y=canvasHeight-1; y>=0; --y){
							setPix(pixels, x, y, 198,198,22, canvasWidth);
						}
					}else{
						let grn=(xdc!=-1 && x>=xdc && x<=xdt)?true:false;
						if(grn===true){
							for (let y=canvasHeight-1; y>=0; --y){
								setPix(pixels, x, y, 0,171,14, canvasWidth);
							}
						}else{
							for (let y=canvasHeight-1; y>=0; --y){
								setPix(pixels, x, y, 144,67,204, canvasWidth);
							}
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
		for (let k=len-1; k>=0; --k){
			let t_i=i.video.buffered.end(k);
			let s_i=i.video.buffered.start(k);
			let prp=canvasWidth_1/(latest-earliest);
			let xds=Math.ceil((s_i-earliest)*prp);
			let xdt=Math.floor((t_i-earliest)*prp);
			let c_i=i.video.currentTime;
			let xdc=(c_i>=s_i && c_i<=t_i)?Math.ceil((c_i-earliest)*prp):-1;
			for (let x=xds; x<=xdt; ++x){
				if(x===xdc){
					for (let y=canvasHeight-1; y>=0; --y){
						setPix(pixels, x, y,198,198,22, canvasWidth);
					}
				}else{
					let grn=(xdc!=-1 && x>=xdc && x<=xdt)?true:false;
					if(grn===true){
						for (let y=canvasHeight-1; y>=0; --y){
							setPix(pixels, x, y, 0,171,14, canvasWidth);
						}
					}else{
						for (let y=canvasHeight-1; y>=0; --y){
							setPix(pixels, x, y, 144,67,204, canvasWidth);
						}
					}
				}
			}
		}
	}
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
let i=findInst(event.target);
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
let i=findInst(event.target);
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

function play_hdl(event) {
let i=findInst(event.target);
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
let i=findInst(event.target);
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
let i=findInst(event.target);
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
    if(i.elig===false){
        return;
    }
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
let i=findInst(event.target);
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
let i=findInst(event.target);
if(!!i){
i.entered=true;
def_retCSS(i,false,true);
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
	let dpl=parseInt(opt.getAttribute('dp'));
	opt.textContent =  opt.getAttribute('nm')+' '+opt.getAttribute('preText')+parseFloat(val).toFixed(dpl)+pst;
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
		let dpl=parseInt(opt.getAttribute('dp'));
		opt.textContent =  opt.getAttribute('nm')+' '+opt.getAttribute('preText')+parseFloat(val).toFixed(dpl)+pst;
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
		let opts=i.colSel.children;
		let grn=opts[7];
		let grn_val=parseFloat(grn.getAttribute('curr'));
		if(grn_val>0){
			i.clrMtrx_tag2=`<feTurbulence y="0px" result="waves" type="turbulence" baseFrequency="14.46" numOctaves="1" seed="5">
			<animate attributeName="seed" from="0" to="2147483648" dur="12ms" repeatCount="indefinite"></animate>
		</feTurbulence>
       <feColorMatrix result="grey" type="matrix" values="0.3333 0.3333 0.3333 -0.54 0 0.3333 0.3333 0.3333 -0.54 0 0.3333 0.3333 0.3333 -0.54 0 0 0 0 ${grn_val} 0"></feColorMatrix>
	  <feMerge result="compos">
		<feMergeNode in="SourceGraphic"></feMergeNode>
		<feMergeNode in="grey"></feMergeNode>
	</feMerge>
    <feColorMatrix in="compos" type="matrix"
			values="${outp_flatJ}">
	</feColorMatrix>`;
		}else{
			i.clrMtrx_tag2=`<feColorMatrix type="matrix"
			values="${outp_flatJ}">
	</feColorMatrix>`;
	}
					
	i.svg_blob2 = new Blob([i.clrMtrx_tag2], { type: 'image/svg+xml' });
	i.svg_url2 = URL.createObjectURL(i.svg_blob2).split('/').at(-1).split('-').join('');
	let gmm=opts[3].getAttribute('curr');
	let cf=parseFloat(opts[2].getAttribute('curr'));
	let st=parseFloat(opts[0].getAttribute('curr'));
	let satFilt='';
	if(st!==1.0){
		satFilt=`<feColorMatrix type="saturate" values="${st}"/>`;
	}
	let hr=parseFloat(opts[1].getAttribute('curr'));
	let hueFilt='';
	if(hr!==0.0){
		hueFilt=`<feColorMatrix type="hueRotate" values="${hr}"/>`;
	}
	let contFilt='';
	if(cf!==1.0){
		let cs=[0];
		let n=40;
		let rcp_n=1.0/n;
		for(let k=1; k<n; ++k){
			let kn=k*rcp_n;
			cs.push(  kn>0.5 ? 0.5*(Math.pow(Math.abs(2*kn-1),cf)+1) : 0.5*(1-Math.pow(Math.abs(1-2*kn),cf))  ) 
		}
		cs.push(1);
		let cntr=cs.join(' ');
		contFilt=`<feComponentTransfer><feFuncR type="table" tableValues="${cntr}" /><feFuncG type="table" tableValues="${cntr}" /><feFuncB type="table" tableValues="${cntr}" /></feComponentTransfer>`;
	}
	let wcr=parseFloat(opts[4].getAttribute('curr'));
	let bcr=parseFloat(opts[5].getAttribute('curr'));
	let wbcFilt='';
	if( (wcr!==1 || bcr!==0) && (wcr!==bcr) ){
		let slp=1/(wcr-bcr);
		let itp=-slp*bcr;
		wbcFilt=`<feComponentTransfer><feFuncR type="linear" slope="${slp}" intercept="${itp}" /><feFuncG type="linear" slope="${slp}" intercept="${itp}" /><feFuncB type="linear" slope="${slp}" intercept="${itp}" /></feComponentTransfer>`;
	}
	
	let gammaFilt=gmm==1?'':`<feComponentTransfer><feFuncR type="gamma" exponent="${gmm}" amplitude="1" offset="0" /><feFuncG type="gamma" exponent="${gmm}" amplitude="1" offset="0" /><feFuncB type="gamma" exponent="${gmm}" amplitude="1" offset="0" /></feComponentTransfer>`;
	
	let ivt=parseFloat(opts[6].getAttribute('curr'));
	let ivtFilt='';
	if(ivt!==0.0){
		let ivt2=(1-ivt);
		ivtFilt=`<feComponentTransfer><feFuncR type="table" tableValues="${ivt} ${ivt2}"/><feFuncG type="table" tableValues="${ivt} ${ivt2}"/><feFuncB type="table" tableValues="${ivt} ${ivt2}"/></feComponentTransfer>` 
	}
	
	if(i.filt===null || typeof(i.filt)==='undefined'){
		i.video.insertAdjacentHTML('beforeend',`<svg style="display:none !important"; xmlns="http://www.w3.org/2000/svg"><filter primitiveUnits="objectBoundingBox" x='0%' y='0%' width='100%' height='100%' id="${i.svg_url2}">`+i.clrMtrx_tag2+satFilt+hueFilt+contFilt+gammaFilt+wbcFilt+ivtFilt+`</filter></svg>`);
			 i.filt=getMatchingNodesShadow(i.video, 'filter', true, false).find(t=>{return t.id===i.svg_url2;});
	}else{
		i.filt.id=i.svg_url2;
		i.filt.innerHTML=i.clrMtrx_tag2+satFilt+hueFilt+contFilt+gammaFilt+wbcFilt+ivtFilt;
	}

		/*let flt=[`url(#${i.svg_url2})`];
		
		for(let j=0, len_j=opts.length-1;j<len_j; j++ ){
			if(j===2 || j===3){
				continue;
			}
			let opj=opts[j];
			 flt.push(opj.getAttribute('nm')+opj.getAttribute('preText')+opj.getAttribute('curr')+opj.getAttribute('postText'));
		}
		
		i.video.style.setProperty('filter',flt.join(' '),'important');*/
		
		i.video.style.setProperty('filter',`url(#${i.svg_url2})`,'important');
	}
}

function WB_inp(i,c,d) {
		if(d===true){
			i.filt.innerHTML=`<feColorMatrix type="matrix" values="${WB_defMtx_flat}"></feColorMatrix>`;
		}else if(d===false){
			colInp_inp(i);
		}else if(event.type==='input' || c){
			if(c){
				i.WB_eydrop.value=c;
			}
			i.WB_eydrop_txt.textContent=i.WB_eydrop.value.toLocaleUpperCase();
			colInp_inp(i);
		}
}

function cl_inp(i,evt) {
//evt.preventDefault();
evt.stopPropagation();
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
		cl_inp(i,evt);
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
	}else if(t===i.plp){
		plp_clk(i);
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
		let rectP=absBoundingClientRect(i.plp);
	
		if(event.pageX >= rectC.left && event.pageX <= rectC.right && event.pageY >= rectC.top && event.pageY <= rectC.bottom){
			i.clse.focus();
			ct=true;
		}else if(event.pageX >= rectP.left && event.pageX <= rectP.right && event.pageY >= rectP.top && event.pageY <= rectP.bottom){
			plp_clk(i);
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
		//i.WB_eydrop.dispatchEvent(new Event('input'));
		WB_inp(i,undefined,true);
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
		//i.WB_eydrop.dispatchEvent(new Event('input'));
		WB_inp(i,undefined,false);
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
obj.elig=true;
obj.ff=-1;

let plp = document.createElement("button");
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
	colSel.style.cssText="all: initial !important; align-items: center !important; background: buttonface !important; appearance: auto !important; color: black !important;";

	let setts=[
		['Saturate',0,5,0.001,1,3],
		['Hue rotate',0,360,1,0,0],
		['Contrast (S-curve)',0,10,0.001,1,3],
		['Gamma',0,6,0.001,1,3],
		['White crush',0,2,0.001,1,3],
		['Black crush',-1,1,0.001,0,3],
		['Invert',0,1,1,0,0],
		['Dither',0,1,0.001,0,3],
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
		opt.setAttribute('dp',sett[5]);
		let preTxt='(';
		opt.setAttribute('preText',preTxt);
		let isDeg=(sett[0]==='Hue rotate')?'deg)':')';
		opt.setAttribute('postText',isDeg);
		opt.style.cssText="all: initial !important; align-items: center !important; background: buttonface !important; appearance: auto !important; color: black !important;";
		opt.textContent =sett[0]+' '+preTxt+parseFloat(sett[4]).toFixed(parseFloat(sett[5]))+isDeg;
		colSel.appendChild(opt);	
	  });
	colInp= document.createElement("input");
	colInp.type="range";
	let s0=setts[0];
	colInp.min=s0[1];
	colInp.max=s0[2];
	colInp.step=s0[3];
	colInp.value=s0[4];
	colInp.dp=s0[5];
	colInp.title= 'Double-click to reset to default';
	colInp.style.cssText="all: initial !important;appearance: auto !important;width: -webkit-fill-available !important;vertical-align: middle !important;";
	RGB_divs.insertAdjacentHTML('beforeend',`<div><input class="col" type="color" style="all: initial !important;width: 4.808ch !important;background-color: #000000 !important;border: #000000 !important;height: 3ch !important; color: white !important;" id="vis" value="#ffffff">#FFFFFF</input></div>`);
	let chn=RGB_divs.childNodes;
	WB_eydrop_div=chn[0];
	WB_eydrop_div.title='White balance - Double-click to reset to default - Click and hold down to compare current settings with original (just custom colour matrix, if enabled)';
	WB_eydrop_div.style.cssText="all: initial !important;display: flex !important;align-items: center !important;background: #000000 !important;width: fit-content !important;padding-right: 0.5ch !important; color: white !important;";
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
plp.innerHTML="⏯"
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

bdivs.appendChild(plp);
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
cvs.style.setProperty('margin-top','1px','important');
cvs.style.setProperty('user-select','none','important');
cvs.style.setProperty('visibility','visible','important');
cvs.style.setProperty('float','initial','important');
cvs.style.setProperty('border-radius','0%','important');


if(document.fullscreen || document.webkitIsFullScreen){
	obj.video.insertAdjacentElement('beforebegin',sdivs);
}else{
	let anc=getAncestors(obj.video, true, true, false, true);
	let fpt=anc[anc.length-1];
	fpt.insertAdjacentElement('beforebegin', sdivs);
}

obj.plp=plp;
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
	obj.filt=null;
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
obj.fadedBtnsTime=false;
obj.fadedBtns=false;
obj.faded=false;
obj.top=0;
obj.left=0;
obj.sDivsCSS2="";
obj.sclr=false;
obj.bufEnd=false;
obj.firstBuf=false;
obj.s_vis=null;
obj.c_vis=null;
obj.obscPrg={};
insts.push(obj);
activeInsts.push(obj);
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

clse.addEventListener('keyup',(evt) => cl_inp(obj,evt));
clse.addEventListener('keydown',(evt) => cl_inp(obj,evt));
clse.addEventListener('change',(evt) => cl_inp(obj,evt));
clse.addEventListener('change',(evt) => cl_inp(obj,evt));

clse.addEventListener('focus',() => cl_focus(obj));

if(doWB){
	colInp.addEventListener('dblclick',() => colInp_reset(obj));
	colInp.addEventListener('input',() => colInp_inp(obj));
	colSel.addEventListener('input',() => colInp_inp(obj,false));
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

function plp_clk(i){
	if(i.video.paused===true){
		i.video.play();
	}else{
		i.video.pause();
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
	let outsideScrub=(m==0 && cvs_clkd===true )?true:false;
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
	time=isFinite(i.video.duration) ? Math.max(0,Math.min(time,i.video.duration)) : time;
	let timeFmt=bf_s_hmmss(time,true);
	let vt=(!isNaN(time) && isFinite(time))?true:false;
	let vN=(typeof(l)!=='undefined')?Math.round((1+15*Math.max(Math.min(l,1),0))*100)*0.01:null;
	let icv=(vN===null)?null:vN.toLocaleString('en-GB', {minimumFractionDigits: 0, maximumFractionDigits: 7, useGrouping: false});
	let ctv=e.ctrlKey && icv!==null ? true: false;
	if(vt || ctv){
		fadeBtns(i);
		i.cvs.style.setProperty('opacity',0.64,'important');
		i.prgBarTime.innerText= ctv ? icv+'x' :  timeFmt  ;
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
			if( (c_pass || outsideScrub===true) && (vt || ctv)){
				fadeBtns(i);
				i.cvs.style.setProperty('opacity',0.64,'important');
				if(ctv){
					i.clse.value=icv;
					i.prgBarTime.innerText=icv+'x' ;
					if(i.ff===1){
						forcePlaybackRate(i);
					}
				}else if(vt){
					i.video.currentTime=time;
					i.prgBarTime.innerText=timeFmt;
				}else 
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
	
			let eligInsts=[];
			let eligInsts_vids=[];
			let toRmv=[];
            
			for(let i=0, len_i=insts.length; i<len_i; ++i){
				let insti=insts[i];
				let v=insti.video;
                let ev=eligVid(v);
                if(ev[0]===false){ //not in page
                    toRmv.push(insti);
                }else if( ev[1]===false ){ //in page but readyState=0 and non-empty src
                    insti.elig=false;
					elRemover(insti.sdivs);
				}else{
					eligInsts.push(insti);
					eligInsts_vids.push(v);
				}
			}

			insts=eligInsts;
			
			for(let i=0, len_i=toRmv.length; i<len_i; ++i){
				let remi=toRmv[i];
                remi.elig=false;
				let v=remi.video;
				try{
					v.removeEventListener('progress',progress_hdl);
					v.removeEventListener('play',play_hdl);
					v.removeEventListener('waiting',waiting_hdl);
					v.removeEventListener('pointermove',pointermove_hdl);
					v.removeEventListener('ratechange',ratechange_hdl);
					v.removeEventListener('seeked',seeked_hdl);
					v.removeEventListener('seeking',seeking_hdl);
					v.removeEventListener('ended',ended_hdl);
				}
				catch(err){
					;
				}
				finally{
                    remi.sdivs.style.display='none';
                    elRemover(remi.sdivs);
                    activeInsts=activeInsts.filter( s=>{return s!==remi;});
                    remi=null;
				}
			}
			
			let DOMvids=getMatchingNodesShadow(document,['VIDEO','AUDIO'],true,false);
			for(let i=0, len_i=DOMvids.length; i<len_i; ++i){
				let dv=DOMvids[i];
                let fnd=null;
                if(!eligInsts_vids.includes(dv) && get_src(dv)!=='' && dv.readyState>0){
                    for(let j=0, len_j=activeInsts.length; j<len_j; ++j){
                        let aij=activeInsts[j];
                        let ajv=aij.video;
                        if(ajv===dv){
                            fnd=aij;
                            break;
                        }
                    }
                }
                if(fnd!==null){
                    fnd.elig=true;
                    insts.push(fnd);
                    //re-inject:
                    if(document.fullscreen || document.webkitIsFullScreen){
                        fnd.video.insertAdjacentElement('beforebegin',fnd.sdivs);
                    }else{
                        let anc=getAncestors(fnd.video, true, true, false, true);
                        let fpt=anc[anc.length-1];
                        fpt.insertAdjacentElement('beforebegin', fnd.sdivs);
                    }
                    positionBar(fnd,true,true,true);
                }else if( !tempInsts.includes(dv) && !eligInsts_vids.includes(dv) && eligVid(dv)[1]===true ){
                    tempInsts.push(dv);
                    if(ldmv.includes(dv)){
                        ldmv=ldmv.filter( s=>{return s!==dv;});
                        dv.removeEventListener('loadedmetadata',checker);
                    }
					creator(dv);
                    tempInsts=tempInsts.filter( v=>{return v!==dv;});
				}else if(!ldmv.includes(dv)){ //loadedmetadata backup
                    dv.addEventListener('loadedmetadata',checker);
                    ldmv.push(dv);
                }
			}
	}

restore_options();