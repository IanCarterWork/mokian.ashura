import { MokianHeader } from "../../overlays/header.js";
import { MokianMenu } from "../../overlays/menu.js";
import { MokianScreen, MokianView } from "../../overlays/viewer.js";
import { Mokian } from "../../core/0.0.4.js";
import {Kunai} from "./Index.js";

const tpl = {};


tpl.Empty = function($Layer, $O){

    let _screen = new MokianScreen($Layer, $O);
    
    $O = typeof $O=='object'?$O:{};

    $O.Header = typeof $O.Header=='object'?$O.Header:{};


    const menu = $Layer.querySelector('mok-menu');

    if(menu instanceof HTMLElement){ menu.parentNode.removeChild(menu); }


    const header = $Layer.querySelector('mok-header');

    if(header instanceof HTMLElement){ header.parentNode.removeChild(header); }

    _screen.setAttribute('Overlay:View', 'Empty')

    document.title = MokianTemplate.SetTitle($O.Header.Title||false, $Settings['App:Title']||false);

    // if(typeof $O.Navigate == 'string'){

    //     _screen.Navigate($O.Navigate,true);

    // }

    return MokianTemplate.Check($Layer, 'Empty').Bind(this, _screen);
    
}


tpl.Full = function($Layer, $O){

    let screen = new MokianScreen($Layer),header,menu,view;
    
    $O = typeof $O=='object'?$O:{};

    $O.Header = typeof $O.Header=='object'?$O.Header:{};


    header = new MokianHeader(); screen.appendChild(header);

        header.setAttribute('Ui:Fixed',':true');

        header.setAttribute('Position','Above');


    let hbegin,htitle,ttl,hend;

        hbegin = document.createElement('div'); header.appendChild(hbegin);

            hbegin.setAttribute('Ui:Section','Header:Begin');

        htitle = document.createElement('div'); header.appendChild(htitle);

            htitle.setAttribute('Ui:Section','Header:TitleBar');

                ttl = document.createElement('div'); htitle.appendChild(ttl);

                    ttl.setAttribute('Ui:Section','Header:Title');

        hend = document.createElement('div'); header.appendChild(hend);

            hend.setAttribute('Ui:Section','Header:End');


    menu = new MokianMenu(typeof $O.Menu == 'object'?$O.Menu:null); screen.appendChild(menu);

        menu.setAttribute('Ui:Fixed',':true');

        menu.setAttribute('Position','Left');


    view = new MokianView(); screen.appendChild(view);



    if(typeof $O.Header.Title == 'string'){

        document.title = `${$O.Header.Title} - ${$Settings['App:Title']||''}`;

        ttl.innerHTML = $O.Header.Title;
        
    }

    if(typeof $O.Navigate == 'string'){

        screen.Navigate($O.Navigate,true);

    }


    return screen;
    
}




tpl.BelowNavigation = function($Layer, $O){

    let screen = new MokianScreen($Layer),header,menu,view;
    
    $O = typeof $O=='object'?$O:{};

    $O.Header = typeof $O.Header=='object'?$O.Header:{};


    header = new MokianHeader(); screen.appendChild(header);

        header.setAttribute('Ui:Fixed',':true');

        header.setAttribute('Position','Above');


    let hbegin,htitle,ttl,hend;

        hbegin = document.createElement('div'); header.appendChild(hbegin);

            hbegin.setAttribute('Ui:Section','Header:Begin');

        htitle = document.createElement('div'); header.appendChild(htitle);

            htitle.setAttribute('Ui:Section','Header:TitleBar');

                ttl = document.createElement('div'); htitle.appendChild(ttl);

                    ttl.setAttribute('Ui:Section','Header:Title');

        hend = document.createElement('div'); header.appendChild(hend);

            hend.setAttribute('Ui:Section','Header:End');


    menu = new MokianMenu(typeof $O.Menu == 'object'?$O.Menu:null); screen.appendChild(menu);

        menu.setAttribute('Ui:Fixed',':true');

        menu.setAttribute('Position','Below');


    view = new MokianView(); screen.appendChild(view);



    if(typeof $O.Header.Title == 'string'){

        document.title = `${$O.Header.Title} - ${$Settings['App:Title']||''}`;

        ttl.innerHTML = $O.Header.Title;
        
    }

    if(typeof $O.Navigate == 'string'){

        screen.Navigate($O.Navigate,true);

    }


    return screen;
    
}



export const KunaiScreen = tpl;
