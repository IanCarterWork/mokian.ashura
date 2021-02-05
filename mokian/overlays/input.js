
import { Mokian, MokianOverlay, MokianProps, MokianState } from "../core/0.0.4.js";

Mokian.Core.Asset.Style('input', '0.0.1');




const overlay = MokianOverlay.Create('input', function($Layer){

    const FiD = `i${Math.ceil(Math.random()*1000000000)}`;
    

    this.GotBlur = (ev)=>{

        let e = ev.target||ev.srcElement,val = e.value, lock = $Layer.getAttribute('Ui:Fully:Locked')||false;

        if(!lock){
            
            if(val.replace(new RegExp(' '), '').length > 1){ $Layer.setAttribute('Ui:Fully',''); }

            else{ $Layer.removeAttribute('Ui:Fully'); }
 
        }

        else{ $Layer.setAttribute('Ui:Fully', ''); }
 
        return false;

    };
    

    this.GotClean = (ev)=>{

        let e = Mokian.Take(`#${FiD}`, this)

        if(e instanceof HTMLElement){ e.value = ''; e.focus(); }

        return false;

    };
    

    this.GotToggle = (ev)=>{

        let e = Mokian.Take(`#${FiD}`, this);

        let sh = Mokian.Take('[Input\\:Action="ToggleShow"]', this);

        let hi = Mokian.Take('[Input\\:Action="ToggleHide"]', this);


        if(e instanceof HTMLElement){ 

            const st = e.getAttribute('data-type')||'0';

            if(st == '0'){

                sh.style.display = 'none';

                hi.style.display = null;

                e.type = 'text';

                e.setAttribute('data-type', '1');
                
            }

            else{

                hi.style.display = 'none';

                sh.style.display = null;

                e.type = 'password';

                e.setAttribute('data-type', '0');
                
            }
            
            e.focus();

        }

        return false;

    };


    const GotInput = (type)=>{

        switch((type||'').toLowerCase()){

            case 'checkbox':

                return (`
                    
                    <label for="${FiD}" Input:Label="Static" >${$Layer.Props.placeholder||$Layer.Props.label||''}</label>

                    <input id="${FiD}" Input:Set Input:Field="Static" type="checkbox" name="${$Layer.Props.name||''}" value="${$Layer.Props.value||''}">

                `);

            break;

            default:

                if( type == 'date' || type == 'time' ){ 
                    
                    $Layer.setAttribute('Ui:Fully', ''); $Layer.setAttribute('Ui:Fully:Locked', 'True'); 
                
                }


                return (`
                
                    <div Input:Field="Float" >

                        <input id="${FiD}" Input:Set @Blur="this.GotBlur" type="${type||'text'}" name="${$Layer.Props.name||''}" >

                    </div>
                
                    <div Input:Label="Float" >

                        <label for="${FiD}"  >${$Layer.Props.placeholder||$Layer.Props.label||''}</label>
                    
                    </div>

                `);

            break;
            
        }

    };


    const GotActions = ()=>{

        let tac = [];
  

        if('action:toggle' in $Layer.Props){

            tac[tac.length] = `<div Input:Action="ToggleShow" @Click="this.GotToggle" ><mok-glyph name="eye"></mok-glyph></div>`;

            tac[tac.length] = `<div Input:Action="ToggleHide" @Click="this.GotToggle" style="display:none" ><mok-glyph name="eye-slash"></mok-glyph></div>`;

        }
          

        if('action:cleaner' in $Layer.Props){

            tac[tac.length] = `<div Input:Action="Cleaner" @Click="this.GotClean" ><mok-glyph name="times"></mok-glyph></div>`;

        }

        return tac.join('')
        
    }
    

    $Layer.setAttribute('Ui:Fx', '');


    const hook = new MokianHooks.Dynamic($Layer);

    const props = MokianProps.Define($Layer, {});

    const state = MokianState.Define($Layer, {

        Glyph: $Layer.Props.glyph

    });



    $Layer.innerHTML = '';
    
    return $Layer.Mount(`
    
        <div Input:Container Stack:Flex="Row" >

            <div Input:Glyph Stack:Flex="Row" >
            
                <mok-glyph name="{this.Glyph}"></mok-glyph>
                
            </div>
            
            <div Input:Content Stack:Flex="Row" Stack:VAlign="Center" >

                ${GotInput($Layer.Props.type)}

            </div>
            
            <div Input:Actions Stack:Flex="Row" >

                ${ GotActions() }
            
            </div>

        </div>
    
    `);

});


export const MokianInput = overlay;