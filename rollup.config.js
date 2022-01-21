import {version} from "./package.json";
import { nodeResolve } from '@rollup/plugin-node-resolve';
import ts from "rollup-plugin-ts";

export default [
    {
        input: "src/GetAddress.ts",
        output: {
            file:"dist/getaddress-autocomplete-" + version + ".js",
            format:"iife", 
            name:'getAddress',
            sourcemap:  "inline"
        }
        ,plugins:[nodeResolve(),ts()]
    },
    {
        input: "src/GetAddress.ts",
        output: {
            file:"dist/getaddress-autocomplete-" + version + ".mjs",
            format:"es"
        }
        ,plugins:[nodeResolve(),ts()]
    }
]