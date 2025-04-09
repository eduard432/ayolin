import { CoreTool } from "ai";
import { generateGetProductTool, getProductSettings } from "./getProducts/getProduct";
import { farenhetToCelsius } from "./farenheitToCelsius/convertGrades";
import { generateWeatherTool, getWeatherSettings } from "./getWeather/getWeather";
import { generateGetContextTool, getContextSettings } from "./getContext";


export const aiPlugins: {
    [key: string]: {
        name: string,
        settings: ({[key: string]: string}),
        description?: string
    }
} = {
    'get_weather': {
        name: 'Obtener Clima',
        settings: getWeatherSettings,
        description: 'Proporciona información sobre el clima actual y pronósticos para ubicaciones específicas.'
    },
    'convert_farenheitToCelsius': {
        name: 'Convertir Farenheit a Celsius',
        settings: {},
        description: 'Convierte temperaturas de grados Farenheit a Celsius.'
    },
    'get_product':  {
        name: 'Producto Zoho',
        settings: getProductSettings,
        description: 'Proporciona información sobre productos de Zoho, incluyendo precios y disponibilidad.'
    },
    'get_context': {
        name: 'Obten Contexto de PDFs',
        settings: getContextSettings,
        description: 'Proporciona información sobre el contexto de un libro en PDF, incluyendo resumen y análisis.'
    }
}

export const getAiPlugin = (id: string, settings: {[key: string]: string}) => {
    const aiPlugins: {[key: string]: CoreTool} = {
        'get_weather': generateWeatherTool({url: settings.url}),
        'convert_farenheitToCelsius': farenhetToCelsius,
        'get_product': generateGetProductTool({url: settings.url}),
        'get_context': generateGetContextTool({bookId: settings.bookId})
    }
    return aiPlugins[id]
}

