
import ServiceAwake from "./service.awake.js";


export const ServicesAwakeController = new ServiceAwake({

    Vendor: `${$Settings['Service:Provider:URL']||$Settings['Http:Host']||'./'}ServicesAwake`

    , APIKey: `0123456`

    , Lang: $Settings['Vendor:Lang']||'Fr-fr'
    
});;