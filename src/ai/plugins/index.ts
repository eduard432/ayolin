import { CoreTool } from "ai";
import { getProductTool } from "./getProducts/getProduct";

export const aiPlugins: {[key: string]: CoreTool} = {
    'get_product': getProductTool
}