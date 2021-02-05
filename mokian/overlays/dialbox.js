import { Mokian, MokianOverlay, MokianProps } from "../core/0.0.4.js";


Mokian.Core.Asset.Style('dialbox', '0.0.1');


const modal = MokianOverlay.Create('dialbox', function(){

    const  hook = new MokianHooks.Dynamic(this);

    const  props = MokianProps.Define(this,{});

    const CreateControlItem = ()=>{

        let mi = document.createElement('div');

        mi.setAttribute('Control:Item', '');

        return mi;

    };

    const CreateControlButton = (item, at)=>{

        let mi = document.createElement('div');

        mi.setAttribute(`Control:${at}`, '');

        item.appendChild(mi);

        return item;

    };

    const showHeader = ()=>{

        const exi = Mokian.Takes('[DialBox\\:Header]', this)



        return (exi instanceof HTMLElement) ? '' : ((
            
            ('label' in this.Props) 
            
            || ('can:minimize' in this.Props)

            || ('can:maximize' in this.Props)

            || ('can:close' in this.Props)
            
            ) ? 
            
            ` <div DialBox:Header >

                <div DialBox:Icon >

                    <mok-glyph name="{% this.Props.glyph %}"></mok-glyph>
                
                </div>

                <div DialBox:TitleBar >{% this.Props.label %}</div>
                
                <div DialBox:Control ></div>

            </div> ` 
            
            : '')
            
        ;

    };
    
    this.CloseBox = ()=>{

        hook.Dispatch('BeforeClose', []);
            
        this.ontransitionend = ()=>{

            this.parentNode.removeChild(this);

            this.ontransitionend = null;

            hook.Dispatch('Close', []);
            
        }

        this.setAttribute('Status', 'Close');
        
    };
    
    this.MaximizeBox = ()=>{

        const st = this.getAttribute('Ui:State');

        if(st != 'Maximize'){

            this.setAttribute('Ui:State:Callback', st||'Normal' );

            this.setAttribute('Ui:State', 'Maximize');
            
            hook.Dispatch('Maximize', [{BeforeState:st}]);

        }

        else{

            this.RestaureBox();
            
        }
        
    };
    
    this.MinimizeBox = ()=>{

        this.setAttribute('Ui:State:Callback', this.getAttribute('Ui:State')||'Normal' );

        this.setAttribute('Ui:State', 'Minimize');

        hook.Dispatch('Minimize', []);

        setTimeout(()=>{
            
            this.onclick = ()=>{ this.RestaureBox(); }

        },60)

        
    };
    
    this.RestaureBox = ()=>{

        this.setAttribute('Ui:State', this.getAttribute('Ui:State:Callback')||'Normal' );

        this.setAttribute('Ui:State:Callback', null);
            
        this.onclick = null;
        
        hook.Dispatch('Restaure', []);

    };


    hook.Listen('WhenReady', (parser, $layer)=>{

        this.HeaderControl = this.HeaderControl||this.querySelector('[DialBox\\:Control]');

        if(this.HeaderControl instanceof HTMLElement){
            
            if('can:minimize' in this.Props){

                let mi = CreateControlButton(CreateControlItem(), 'Minimize');

                mi.onclick = ()=>this.MinimizeBox();

                this.HeaderControl.appendChild(mi);

            }
            
            if('can:maximize' in this.Props){

                let ma = CreateControlButton(CreateControlItem(), 'Maximize');

                ma.onclick = ()=>this.MaximizeBox();

                this.HeaderControl.appendChild(ma);

            }
            
            if('can:close' in this.Props){

                let ma = CreateControlButton(CreateControlItem(), 'Close');

                ma.onclick = ()=>this.CloseBox();

                this.HeaderControl.appendChild(ma);

            }

        }


    });

    // this.UseProps().DefineState({ Title: 'Titre du Modal' });

    // this.PropChanged = (pn,pv)=> {

    //     // console.log('Props Change', pn, pv, this.Props)
        
    // };


    return this.View(`

        <div>
        
            ${showHeader()}
            
            <div DialBox:Container >${this.innerHTML}</div>

        </div>

    `);

});


export const MokianDialBox = modal;
