
/**
 * Mokian MenuBox Element
 */

import { Mokian } from "../core/0.0.4.js";
import $Settings from "../settings/index.js";
import { MokianNavigation } from "./navigation.js";


Mokian.Core.Asset.Style('menu', '0.0.1');


const SetAtciveMenuItem = function(ev){

    const _it = document.querySelectorAll(`[MenuBox\\:Item][Item\\:Path]`);

    if(_it.length){

        Object.values(_it).forEach((i)=>{
            
            const path = i.getAttribute('Item:Path');

            i.setAttribute('MenuBox:Item', 'Normal'); 

            if(path){

                if($Settings['Navigation:UseHash'] === true){

                    if(location.hash.indexOf(path) > -1){ i.setAttribute('MenuBox:Item', 'Actived'); return; }
                    
                }

                else{

                    if(ev.Path.indexOf(path) > -1){ i.setAttribute('MenuBox:Item', 'Actived'); return; }
                    
                }

            }

        });

    }

};



class mMenuBoxElement extends HTMLElement{

    
    constructor(){

        super();

        // this.Props = arguments;

        this.Sheet = arguments[0]||{};

    }


    connectedCallback(){

        // console.log('Mokian MenuBox ', this.Sheet)

        this.BuildItems();

    }


    BuildItems(){

        let bx={};

        bx.Items = this.querySelector('[MenuBox\\:Navigation]');

        if(!(bx.Items instanceof HTMLElement)){
            
            bx.Items = document.createElement('nav'); bx.Items.setAttribute('MenuBox:Navigation',':true'); this.appendChild(bx.Items);

        }

        if(typeof this.Sheet.Items == 'object'){

            
            this.Sheet.ShowGlyph = (typeof this.Sheet.ShowGlyph == 'boolean') ? this.Sheet.ShowGlyph : true;

            this.Sheet.ShowLabel = (typeof this.Sheet.ShowLabel == 'boolean') ? this.Sheet.ShowLabel : true;
          

            Object.values(this.Sheet.Items).forEach((item,ki)=>{

                let bix = document.createElement('a');

                bix.setAttribute('MenuBox:Item', 'Normal');

                bix.setAttribute('Item:Path', `${item.View}`);

                bix.setAttribute('tabindex', '0');

                bix.setAttribute('href', 'javascript:void(0)');

                bix.addEventListener('click', (ev)=>{

                    let scr = MokianNavigation.CurrentScreen();

                    if(scr instanceof HTMLElement){ scr.Navigate(item.View); }

                    SetAtciveMenuItem(ev);
                    
                });


                if(this.Sheet.ShowGlyph === true){
                    
                    let glyph = document.createElement('div');

                    glyph.setAttribute('MenuBox:Glyph', '');

                    glyph.innerHTML = `<i class="${MokianGlyphsObject.Set(item.Glyph)}" ></i>`;
  
                    bix.appendChild(glyph);

                }


                if(this.Sheet.ShowLabel === true){
                    
                    let label = document.createElement('div');

                    label.setAttribute('MenuBox:Label', '');

                    label.innerHTML = `${item.Label}`;
                    
                    bix.appendChild(label);

                }

                bx.Items.appendChild(bix);

            });
    
        }

    }


}

customElements.define(`mok-menu`, mMenuBoxElement );


MokianHooks.Static.Listen('NavigateChange', (ev)=>SetAtciveMenuItem(ev));


export const MokianMenu = mMenuBoxElement;
