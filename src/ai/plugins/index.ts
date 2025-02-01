import { CoreTool } from "ai";
import { generateGetProductTool, getProductSettings } from "./getProducts/getProduct";
import { farenhetToCelsius } from "./farenheitToCelsius/convertGrades";
import { generateWeatherTool, getWeatherSettings } from "./getWeather/getWeather";


export const aiPluginSettings: {[key: string]:  ({[key: string]: string}) | boolean} = {
    'get_weather': getWeatherSettings,
    'convert_farenheitToCelsius': false,
    'get_product':  getProductSettings
}

export const getAiPlugin = (id: string, settings: {[key: string]: string}) => {
    const aiPlugins: {[key: string]: CoreTool} = {
        'get_weather': generateWeatherTool({url: settings.url}),
        'convert_farenheitToCelsius': farenhetToCelsius,
        'get_product': generateGetProductTool({url: settings.url})
    }
    return aiPlugins[id]
}

