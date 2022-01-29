import {version} from "./package.json";
import { nodeResolve } from '@rollup/plugin-node-resolve';
import ts from "rollup-plugin-ts";
import {terser} from 'rollup-plugin-terser';

/* const version = 'test'; */

export default [
    
    {
        input: "src/GetAddress.ts",
        output: {
            file:"dist/getaddress-autocomplete.mjs",
            format:"es",
        }
        ,plugins:[nodeResolve(),ts()]
    },
    {
        input: "src/GetAddress.ts",
        output: 
            {
                file:"dist/getaddress-autocomplete-" + version + ".js",
                format:"iife", 
                name:'getAddress',
                sourcemap:  "inline"
            }
        
        ,plugins:[nodeResolve(),ts(
            {tsconfig: {
                declaration: false
            }}
        )]
    },
    {
        input: "dist/getaddress-autocomplete.mjs",
        output: 
            {
                file:"dist/getaddress-autocomplete-" + version + ".min.js",
                format:"iife",
                name:'getAddress'
            },
        plugins:[terser()]
    }
]