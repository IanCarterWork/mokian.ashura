import { MokianOverlay, MokianProps, MokianState } from "../core/0.0.4.js";
import { MokianColor } from "../overlays/coloring.js";
import { MokianForm } from "../overlays/form.js";
import { MokianFxOverlay } from "../overlays/fx.js";
import { MokianGlyph, MokianGlyphObject } from "../overlays/glyph.js";
import MokianHooks from "../overlays/hooks.js";
import { MokianInput } from "../overlays/input.js";
import { MokianNavigation } from "../overlays/navigation.js";
import MokianTemplate from "../overlays/template.js";
import $Settings from "../settings/index.js";
import { Kunai } from "../templates/Kunai-0.0.1/Index.js";
import { KunaiScreen } from "../templates/Kunai-0.0.1/Screen.js";






MokianTemplate

    .Use('Kunai', '0.0.1')

    .Parameters('Blank', {

        Navigate: $Settings['View:Current']

    })
    
;

const myApp = MokianOverlay.Create('root', (app)=>{

    const appHook = new MokianHooks.Dynamic(app);

    const appState = MokianState.Define(app, {});

    const appProps = MokianProps.Define(app, {});

    appHook.Listen('WhenReady', ()=>{})
    

    return KunaiScreen.Empty(app, MokianTemplate.$Parameters['Blank']);


});

export const mokianPlayoutApp = myApp;