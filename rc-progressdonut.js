function progressDonut(options){
    var _cpc=this,
        _cpcID=(Math.floor(Math.random()*10000)+'').substr(0,4),
        _cpcCanvas=null,
        defaults={"size":300,"barColor1":"#000","barColor2":"#d12","textColor":"#333","barSize":15,"bgColor":"none","complete":null,"progress":null};
    if(!options) options=defaults; 
    _cpc.size=options.size || defaults.size;
    _cpc.barColor1=options.barColor1 || defaults.barColor1;
    _cpc.barColor2=options.barColor2 || defaults.barColor2;
    _cpc.textColor=options.textColor || defaults.textColor;
    _cpc.barSize=options.barSize || defaults.barSize;
    _cpc.bgColor=options.bgColor || defaults.bgColor;
    _cpc.complete=options.complete || null,
    _cpc.progress=options.progress || null;
    
    this.value=function(percentage){
        if(percentage<0){percentage=0}else if(percentage>100){percentage=100};
        callRender(percentage);
        if(_cpc.progress) _cpc.progress(percentage,_cpc);
        if(percentage==100) callComplete();
    }
    
    this.animate=function(options) {
        var defaults={"value":100,"speed":5,"step":0.5};
        if(!options) options=defaults;
        var f=options.value || defaults.value, s=options.speed || defaults.speed,i=options.step || defaults.step;
        if(f>100 || f<0) f=100;
        callAnim(0,f,i,s);
    }
    
    this.appendTo=function(elementID){
        var p=document.getElementById(elementID);
        if(p){
            if(_cpcCanvas) _cpcCanvas.parentNode.remove(_cpcCanvas);
            _cpcCanvas=document.createElement("canvas");_cpcCanvas.id='cpc'+_cpcID;_cpcCanvas.width=_cpc.size;_cpcCanvas.height=_cpc.size;
            p.appendChild(_cpcCanvas);
        }
        return _cpc;
    }
    
    function callAnim(cpc,fpc,stp,spd){
        if(cpc>fpc) cpc=fpc;
        _cpc.value(cpc);
        if(cpc<fpc) setTimeout(function(){callAnim(cpc+stp,fpc,stp,spd)},spd); else callComplete();
    }
    
    function Color(cssValue){
        var _this=this,s=cssValue+'';_this.r=0;_this.g=0;_this.b=0;
        if (s.substr(0,1)=='#'){
            s=s.substr(1); if(s.length==3) s=s.substr(0,1)+s.substr(0,1)+s.substr(1,1)+s.substr(1,1)+s.substr(2,1)+s.substr(2,1);
            if(s.length==6){_this.r=parseInt(s.substr(0,2),16);_this.g=parseInt(s.substr(2,2),16);_this.b=parseInt(s.substr(4,2),16);};
            };
        this.shiftTo=function(targetColor,shiftBy){
            _this.r=_this.r+Math.floor((targetColor.r-_this.r)*shiftBy);
            _this.g=_this.g+Math.floor((targetColor.g-_this.g)*shiftBy);
            _this.b=_this.b+Math.floor((targetColor.b-_this.b)*shiftBy);
            return _this;
            };
        this.cssRGB=function(){return "rgb("+this.r+","+this.g+","+this.b+")"};
    }

    function callRender(pc){
        var p=pc/100,
            c=_cpcCanvas.getContext("2d"),
            d=_cpc.size,
            r=d/2,
            a=((Math.PI*2)*p)-Math.PI/2,
            barColor=new Color(_cpc.barColor1).shiftTo(new Color(_cpc.barColor2),p).cssRGB();
        c.clearRect(0,0,d,d);
        c.beginPath(); c.moveTo(r,r); c.lineTo(r,0); c.arc(r,r,r,-Math.PI/2,a); c.lineTo(r,r); c.closePath();
        c.fillStyle=barColor; c.fill();
        c.beginPath(); c.save(); c.arc(r,r,r-_cpc.barSize,0,Math.PI*2); c.closePath(); c.clip(); c.clearRect(0,0,d,d); c.restore();
        c.beginPath(); c.fillStyle=_cpc.textColor; c.font="bold 50px Arial";
        c.textAlign="center"; c.textBaseline="middle";
        c.fillText(Math.ceil(pc)+"%",r,r);
        c.closePath();
    }
    
    function callComplete(){
        if(typeof(_cpc.complete)=='function') _cpc.complete(_cpc);
    }
    return this;
}

