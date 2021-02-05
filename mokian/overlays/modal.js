import { Mokian, MokianOverlay, MokianProps } from "../core/0.0.4.js";
import { MokianDialBox } from "./dialbox.js";


Mokian.Core.Asset.Style('modal', '0.0.1');



const modal = MokianOverlay.Create('modal', function(){

    const  hook = new MokianHooks.Dynamic(this);

    const props = MokianProps.Define(this,{})

    this.CloseBox = ()=>{

        hook.Dispatch('BeforeClose', []);

        this.ontransitionend = ()=>{

            hook.Dispatch('Close', []);

            this.parentNode.removeChild(this);

            this.ontransitionend = null;

            // setTimeout(()=>{

            //     this.parentNode.removeChild(this);

            // },60)

        }

        this.setAttribute('Status', 'Close');
        
    };
    
    hook.Listen('WhenReady', (parser, $layer)=>{

        const backbox = Mokian.Take('[Modal\\:Back]', this);

        const dialbox = Mokian.Take('mok-dialbox', this);


        if(backbox instanceof HTMLElement){

            if(!('locked' in this.Props)){ backbox.onclick = ()=> this.CloseBox(); }
            
        }
        
        if(dialbox instanceof HTMLElement){ dialbox['@Hook'].Listen('Close', ()=>this.CloseBox()); }
        
    });

    // this.UseProps().DefineState({ Title: 'Titre du Modal' });

    // this.PropsChanged = ()=> this.SetState({Title: 'Titre du Modal' }) ;

    return this.View(`

        <div Modal:View >
        
            <div Modal:Back ></div>
            
            <div Modal:Front >
            
            ${this.innerHTML}
            
            </div>
            
        </div>

    `);

});


export const MokianModal = modal;
