
window.MokianSkinMode = {

    UseSystemColorScheme:null

    ,Tones: ['light','dark']

    , Palettes: ['default','royalblue','rangflow']

    , GetCurrentPalette: function(){ return document.querySelector(':root').setAttribute('mokian:color:palette'); }

    , GetCurrentTone: function(){ return document.querySelector(':root').setAttribute('mokian:color:tone'); }

    ,Toggle: function($Palettes = null, $Tones = null){

        this.TogglePalette($Palettes);

        this.ToggleTone($Tones);

        return this;

    }

    ,ToggleTone: function($Tones = null){

        let doc = document.querySelector(':root');

        $Tones = $Tones||this.Tones;

        if(typeof $Tones == 'object'){

            let Current = doc.getAttribute('mokian:color:tone');

            Object.keys($Tones).forEach(($k)=>{

                let $Tone = $Tones[$k];

                if(Current == $Tone){

                    let $Next = $Tones[$k*1+1]||$Tones[0];

                    this.SetTone($Next);

                }

            });
            
        }

        return this;

    }

    ,TogglePalette: function($Palettes = null){

        let doc = document.querySelector(':root');

        $Palettes = $Palettes||this.Palettes;

        if(typeof $Palette == 'object'){

            let Current = doc.getAttribute('mokian:color:tone');

            Object.keys($Palettes).forEach(($k)=>{

                let $Palette = $Palettes[$k];

                if(Current == $Palette){

                    let $Next = $Palettes[$k*1+1]||$Palettes[0];

                    this.SetPalette($Next);

                }

            });
            
        }

        return this;

    }

    , SetTone: function($Next){

        if(typeof $Next != 'string'){return this;}

        let doc = document.querySelector(':root');
        
        doc.setAttribute('mokian\\:color\\:tone', $Next);

        localStorage.setItem('Mok.Theme.Tone', $Next);
        
        return this;

    }

    , SetPalette: function($Next){

        if(typeof $Next != 'string'){return this;}

        let doc = document.querySelector(':root');

        doc.setAttribute('mokian:color:palette', $Next);

        localStorage.setItem('Mok.Theme.Palette', $Next);
        
        return this;

    }

    , InitTone: function(){

        let h = document.querySelector('head');

        let doc = (document.querySelector('[Mok\\:Style\\:Tone=":master"]')||document.createElement('style'));

            doc.setAttribute('Mok:Style:Tone', ':master') ;

        h.appendChild(doc);

        let out = '';

        Object.values(this.Tones).forEach(($Name)=>{

            out += `[mokian\\:color\\:tone="${$Name}"] [Tone\\:HideOn="${$Name}"]{display:none !important;}`;

        });

        doc.innerHTML = out;

        h.insertBefore(doc, h.lastChild)

        return this;
        
    }

    , InitPalette: function(){

        let h = document.querySelector('head');

        let doc = (document.querySelector('[Mok\\:Style\\:Palette=":master"]')||document.createElement('style'))

            doc.setAttribute('Mok:Style:Palette', ':master') ;

        h.appendChild(doc);

        let out = '';

        Object.values(this.Palettes).forEach(($Name)=>{

            out += `[mokian\\:color\\:palette="${$Name}"] [Palette\\:HideOn="${$Name}"]{display:none !important;}`;

        });

        doc.innerHTML = out;

        h.insertBefore(doc, h.lastChild)

        return this;
        
    }

    , Initialize: function(){

        let $Palette = localStorage.getItem('Mok.Theme.Palette');

        if($Palette){ this.SetPalette($Palette); }
        
        

        if(this.UseSystemColorScheme !== true){

            let $Tone = localStorage.getItem('Mok.Theme.Tone');

            if($Tone){ this.SetTone($Tone); }
    
        }
        

        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {

            if(e.matches){ MokianSkinMode.SetTone('dark'); }

            else{ MokianSkinMode.SetTone('light'); }
            
        });

        window.addEventListener('load', ()=>{

            if(this.UseSystemColorScheme === true){

                if(window.matchMedia){
    
                    if (window.matchMedia('(prefers-color-scheme: dark)').matches){ this.SetTone('dark'); }
        
                    else{ this.SetTone('light'); }
        
                }
    
            }

            this.InitTone();

            this.InitPalette();

        })


        return this;
        
    }

}



MokianSkinMode.Initialize();
    

export default MokianSkinMode;