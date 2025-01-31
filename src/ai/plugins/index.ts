import { CoreTool } from "ai";
import { getProductTool } from "./getProducts/getProduct";
import { farenhetToCelsius } from "./farenheitToCelsius/convertGrades";
import { getWeatherTool } from "./getWeather/getWeather";

export const aiPlugins: {[key: string]: CoreTool} = {
    'get_product': getProductTool,
    'get_weather': getWeatherTool,
    'convert_farenheitToCelsius': farenhetToCelsius
}