import { AutocompleteAddress } from "getaddress-api";

export class AddressSelectedEvent 
{
    static dispatch(element:HTMLElement|Document,address:AutocompleteAddress){
        
        const evt  = new Event("getaddress-autocomplete-address-selected",{bubbles:true});
        evt["address"] = address;
        
        element.dispatchEvent(evt);
    }
}