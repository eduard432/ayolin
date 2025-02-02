import { CoreTool } from "ai";
import { generateGetProductTool, getProductSettings } from "./getProducts/getProduct";
import { farenhetToCelsius } from "./farenheitToCelsius/convertGrades";
import { generateWeatherTool, getWeatherSettings } from "./getWeather/getWeather";


export const aiPlugins: {
    [key: string]: {
        name: string,
        settings: ({[key: string]: string})
    }
} = {
    'get_weather': {
        name: 'Obtener Clima',
        settings: getWeatherSettings
    },
    'convert_farenheitToCelsius': {
        name: 'Convertir Farenheit a Celsius',
        settings: {}
    },
    'get_product':  {
        name: 'Producto Zoho',
        settings: getProductSettings
    }
}

export const getAiPlugin = (id: string, settings: {[key: string]: string}) => {
    const aiPlugins: {[key: string]: CoreTool} = {
        'get_weather': generateWeatherTool({url: settings.url}),
        'convert_farenheitToCelsius': farenhetToCelsius,
        'get_product': generateGetProductTool({url: settings.url})
    }
    return aiPlugins[id]
}

