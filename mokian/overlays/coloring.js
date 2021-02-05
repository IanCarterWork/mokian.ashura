
import { Mokian } from "../core/0.0.4.js";


/**
 * Mokian Palette
 */


class MokPal {

    constructor(){

        this.Sheet = document.createElement('style');

        this.Sheet.setAttribute('Mokian:Color:Palette:Respository', '1')

        document.head.insertAdjacentElement('beforeend',  this.Sheet );

    }

    GetNamesByRule(rule){

        const sp = rule.selectorText.split(',');

        const rex = /\[mokian\\:color\\:palette="(.*)"\]/gimu;

        let is = [];


        for (let k = 0; k < sp.length; k++) {
            
            const matches = [...sp[k].matchAll(rex)];

            if(matches.length){

                matches.forEach(m=> is[is.length] = m[1]);

                break;
                
            }
            
        }

        return is;
        
    }

    Upgrades(palettes, name, value){

        if(Array.isArray(palettes)){ palettes.forEach(palette=>this.Upgrade(palette, name, value)) }

        else if(typeof palettes == 'string'){ this.Upgrade(palettes, name, value) }

        else{}

        return this;

    }

    Upgrade(palette, name, value){

        const up = [];

        up[up.length] = `:root[Mokian\\:Color\\:Palette="${palette}"]{${name}-RGBRaw:${Mokian.Style.HexToRGB(value).join(',')};}`;

        up[up.length] = `:root[Mokian\\:Color\\:Palette="${palette}"]{${name}-RGB:rgb(${Mokian.Style.HexToRGB(value).join(',')});}`;

        up[up.length] = `:root[Mokian\\:Color\\:Palette="${palette}"]{${name}-RGBA-Min:rgba(${Mokian.Style.HexToRGB(value).join(',')},.1);}`;
        
        up[up.length] = `:root[Mokian\\:Color\\:Palette="${palette}"]{${name}-RGBA-25:rgba(${Mokian.Style.HexToRGB(value).join(',')},.25);}`;
        
        up[up.length] = `:root[Mokian\\:Color\\:Palette="${palette}"]{${name}-RGBA-50:rgba(${Mokian.Style.HexToRGB(value).join(',')},.50);}`;
        
        up[up.length] = `:root[Mokian\\:Color\\:Palette="${palette}"]{${name}-RGBA-75:rgba(${Mokian.Style.HexToRGB(value).join(',')},.75);}`;
        
        up[up.length] = `:root[Mokian\\:Color\\:Palette="${palette}"]{${name}-RGBA-Max:rgba(${Mokian.Style.HexToRGB(value).join(',')},.90);}`;

        this.Sheet.innerHTML = `${this.Sheet.innerHTML}\n${up.join('\n')}`

        return this;

    }
    
}

/**
 * Mokian Tone
 */

class MokTon {

    constructor(){

        this.Sheet = document.createElement('style');

        this.Sheet.setAttribute('Mokian:Color:Tone:Respository', '1')

        document.head.insertAdjacentElement('beforeend',  this.Sheet );

    }

    GetNamesByRule(rule){

        const sp = rule.selectorText.split(',');

        const rex = /\[mokian\\:color\\:tone="(.*)"\]/gimu;

        let is = [];


        for (let k = 0; k < sp.length; k++) {
            
            const matches = [...sp[k].matchAll(rex)];

            if(matches.length){

                matches.forEach(m=> is[is.length] = m[1]);

                break;
                
            }
            
        }

        return is;
        
    }
   
    Upgrades(tones, name, value){

        if(Array.isArray(tones)){ tones.forEach(tone=>this.Upgrade(tone, name, value)) }

        else if(typeof tones == 'string'){ this.Upgrade(tones, name, value) }

        else{}

        return this;

    }

    Upgrade(tone, name, value){

        const up = [];

        up[up.length] = `:root[Mokian\\:Color\\:tone="${tone}"]{${name}-RGBRaw:${Mokian.Style.HexToRGB(value).join(',')};}`;

        up[up.length] = `:root[Mokian\\:Color\\:tone="${tone}"]{${name}-RGB:rgb(${Mokian.Style.HexToRGB(value).join(',')});}`;

        up[up.length] = `:root[Mokian\\:Color\\:tone="${tone}"]{${name}-RGBA-Min:rgba(${Mokian.Style.HexToRGB(value).join(',')},.1);}`;
        
        up[up.length] = `:root[Mokian\\:Color\\:tone="${tone}"]{${name}-RGBA-25:rgba(${Mokian.Style.HexToRGB(value).join(',')},.25);}`;
        
        up[up.length] = `:root[Mokian\\:Color\\:tone="${tone}"]{${name}-RGBA-50:rgba(${Mokian.Style.HexToRGB(value).join(',')},.50);}`;
        
        up[up.length] = `:root[Mokian\\:Color\\:tone="${tone}"]{${name}-RGBA-75:rgba(${Mokian.Style.HexToRGB(value).join(',')},.75);}`;
        
        up[up.length] = `:root[Mokian\\:Color\\:tone="${tone}"]{${name}-RGBA-Max:rgba(${Mokian.Style.HexToRGB(value).join(',')},.90);}`;

        this.Sheet.innerHTML = `${this.Sheet.innerHTML}\n${up.join('\n')}`

        return this;

    }
     
}

const corl={
    
    Preset:{}

    , Sheet:document.styleSheets

    , Syntax: '--Color-'

    , Main(ev = null){

        const entry = (ev) ? ev.Target : this.Sheet;

        if(entry instanceof StyleSheetList){

            Object.values(entry).forEach(sheet =>this.Factory(sheet));

        }

        else if(entry instanceof HTMLElement){

            if('sheet' in entry){

                this.Factory(entry.sheet||null);

            }


        }

        else{}

    }

    , Factory(sheet = null){

        if(sheet instanceof StyleSheet){

            const palette = (new MokPal());

            const tone = (new MokTon());
            
            Object.values(sheet.rules||sheet.cssRules).forEach((rule)=>{

                if('styleMap' in rule){

                    for (let x = 0; x <= rule.styleMap.size; x++) {

                        if(rule.style[x]){

                            if(rule.style[x].substr(0, this.Syntax.length) == this.Syntax){

                                let hasPalette = palette.GetNamesByRule(rule);

                                let hasTone = tone.GetNamesByRule(rule);

                                if(hasTone){ tone.Upgrades(hasTone, rule.style[x], Mokian.Style.GetVariable(rule.style[x])); }
                                
                                if(hasPalette){ palette.Upgrades(hasPalette, rule.style[x], Mokian.Style.GetVariable(rule.style[x])); }

                            }

                        }
                        
                    }


                }

            })
            
        }
        
    }

};

MokianHooks.Static.Listen('Asset:Style:Connected', ev=>corl.Main(ev) );

corl.Main(null);



export const MokianTone = MokTon;

export const MokianPalette = MokPal;

export const MokianColor = corl;
