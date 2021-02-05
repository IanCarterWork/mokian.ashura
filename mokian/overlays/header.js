import { Mokian } from "../core/0.0.4.js";

Mokian.Core.Asset.Style('header', '0.0.1');


/**
 * Mokian HeaderBox Element
 */

class mHeaderBoxElement extends HTMLElement{

    
    constructor(){

        super();

        this.Props = arguments;

    }

    connectedCallback(){

        // console.log('Mokian HeaderBox ', this)

    }



}

customElements.define(`mok-header`, mHeaderBoxElement );


export const MokianHeader = mHeaderBoxElement;