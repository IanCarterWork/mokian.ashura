import { Mokian, MokianOverlay, MokianProps, MokianState } from "../core/0.0.4.js";


window.MokianGlyphsObject = {

    Style:'fas'

    , Light:'fal'

    , Regular:'fa'

    , Solid:'fas'

    , Brand:'fab'

    , Duotone:'fad'

    , Size:'lg'

    , Prefix:'fa-'

    , Set: function($Slugs, $Style = null, $Size = null, $Prefix = null){

        let s = '';

        $Prefix = $Prefix||this.Prefix||'';

        $Size = $Size||this.Size;

        $Style = $Style||this.Style;

        Object.values($Slugs.split(' ')).forEach(($Slug)=> s += ` ${$Prefix}${$Slug} ` );
        
        return `${$Style} ${$Prefix}${$Size} ${s}`;
        
    }

};




const mGlClass = MokianOverlay.Create('glyph', (layer)=>{

    const appHook = new MokianHooks.Dynamic(layer);

    const props = MokianProps.Define(layer,{

        name: null
        
        , style: null

        , size: null

        , prefix: null
        
    });

    const SetGlyph = ()=> (`${
        
        MokianGlyphsObject.Set( 
            
            layer.Props['name']||'circle'
            
            , layer.Props['gstyle']||null
            
            , layer.Props['size']||null
            
            , layer.Props['prefix']||null 
            
        )
    
    }`);

    const appState = MokianState.Define(layer, {

        Glyph: SetGlyph()

    });

    appHook.Listen('WhenPropsChanged', (ev)=>appState.Set({Glyph: SetGlyph() }) );

    return layer.View(`<span><i class="{this.Glyph}"></i></span>`);

});


export const MokianGlyph = mGlClass;

export const MokianGlyphObject = MokianGlyphsObject;