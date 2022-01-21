import Autocomplete from "./Autocomplete";
import { IOptions } from "./Options";
import Client from 'getaddress-api';
import { IOutputFields,OutputFields } from "./OutputFields";

export function autocomplete(id:string,api_key:string,output_fields?:IOutputFields, options?: IOptions){

    const textbox = document.getElementById(id) as HTMLInputElement;
    
    if(!textbox){
        return;
    }
    const client = new Client(api_key);
    const outputFields = new OutputFields(output_fields);
    
    const autocomplete = new Autocomplete(textbox,client,outputFields,options);
    autocomplete.build();
}