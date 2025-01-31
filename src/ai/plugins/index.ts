import { CoreTool } from "ai";
import { getProductTool } from "./getProducts/getProduct";
import { farenhetToCelsius } from "./farenheitToCelsius/convertGrades";

export const aiPlugins: {[key: string]: CoreTool} = {
    'get_product': getProductTool,
    'convert_f°-c°': farenhetToCelsius
}