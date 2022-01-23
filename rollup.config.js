import {version} from "./package.json";
import { nodeResolve } from '@rollup/plugin-node-resolve';
import ts from "rollup-plugin-ts";

export default [
    
    {
        input: "src/GetAddress.ts",
        output: {
            file:"dist/getaddress-autocomplete.mjs",
            format:"es",
        }
        ,plugins:[nodeResolve(),ts()]
    },
    /* {
        input: "dist/getaddress-autocomplete.mjs",
        output: {
            file:"dist/getaddress-autocomplete-" + version + ".js",
            format:"iife", 
            name:'getAddress',
            sourcemap:  "inline"
        }
    } */
    {
        input: "src/GetAddress.ts",
        output: {
            file:"dist/getaddress-autocomplete-" + version + ".js",
            format:"iife", 
            name:'getAddress',
            sourcemap:  "inline"
        }
        ,plugins:[nodeResolve(),ts()]
    }
]