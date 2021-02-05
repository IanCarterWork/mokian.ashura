
// const mClass = {};


const mCreateScenes = function($Layer){

    if(!($Layer instanceof HTMLElement)){return null;}

    const r = {};

    const s = $Layer.querySelectorAll('[Mokian\\:OverlayScene]');

    let cuts;
    

    if(s.length > 0){

        cuts = document.createElement('section');

        Object.values(s).forEach(i=> { 
            
            r[i.getAttribute('Mokian:OverlayScene')]=i; 
            
            i.style.display = 'none'; 
            
            cuts.appendChild(i); 
        
        });

        s[0].style.display = null;

        cuts.setAttribute('Mokian:OverlayScenes', '');

        $Layer.appendChild(cuts);

    }

    return {Section:cuts,Items:r};

};




let mScenes = class{

    constructor(Params){

        this.Params = Params;

        this.Current = 0;

    }

    Show(k){

        if( k in this.Params.Items){

            if(this.Params.Items[k] instanceof HTMLElement){ 
                
                this.Params.Items[k].style.display = null; 

                this.Current = k;
            
            }

        }

        return this;
        
    }

    Hide(k){

        if( k in this.Params.Items){

            if(this.Params.Items[k] instanceof HTMLElement){ this.Params.Items[k].style.display = 'none'; }

        }

        return this;
        
    }

    ShowOnly(k){

        console.log('Show Only Scene', k, this.Params)

        Object.keys(this.Params.Items).forEach(ki=>this.Hide(ki) );
        
        return this.Show(k);

    }

    HideOnly(k){

        Object.keys(this.Params.Items).forEach(ki=>this.Show(ki) );
        
        return this.Hide(k);

    }



}





export const MokianOverlayCreateScene = mCreateScenes;

export let MokianOverlayScene = mScenes;