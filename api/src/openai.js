const OpenAI = require('openai');
require('dotenv').config();

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Define tu menú aquí
const menu = [
    {
        id: 1,
        name: "Doble Cheese Burger",
        ingredients: ["carne", "queso cheddar"]
    },
    {
        id: 2,
        name: "Bacon Burger",
        ingredients: ["carne", "queso cheddar", "panceta"]
    },
    {
        id: 3,
        name: "Chicken Burger",
        ingredients: ["pollo", "queso cheddar"]
    },
    {
        id: 4,
        name: "Coca-Cola",
        ingredients: []
    }
    // Agrega más productos según sea necesario
];

// Función para consultar a ChatGPT
async function consultChatGPT(query) {
    try {
        const response = await client.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'system',
                    content: `Eres un asistente que ayuda a seleccionar productos de un menú de hamburguesas. Si el usuario menciona un producto específico que está en el menú, responde con el siguiente formato:
            {
              "type": "select_products",
              "ids": [productId, productId]
            }
            Si el producto no está en el menú, sugiere productos similares basados en los ingredientes y responde con el siguiente formato:
            {
              "type": "suggest_product",
              "ids": [productId, productId]
            }. Aquí tienes el menú: ${JSON.stringify(menu)}`
                },
                {
                    role: 'user',
                    content: query
                }
            ],
        });

        const message = response.choices[0].message.content;
        const usedTokens = response;


        return JSON.parse(message);
    } catch (error) {
        console.error("Error al llamar a la API de OpenAI:", error.response ? error.response.data : error.message);
        return null;
    }
}

// Función principal para probar la PoC
async function main() {
    // Ejemplo 1: Usuario quiere una Bacon Burger
    const query1 = "Quiero una Bacon Burger";
    const result1 = await consultChatGPT(query1);
    console.log("Respuesta para 'Quiero una Bacon Burger':", result1);

    // Ejemplo 2: Usuario quiere una hamburguesa con cheddar y panceta
    const query2 = "Me gustaría una hamburguesa con cheddar y panceta";
    const result2 = await consultChatGPT(query2);
    console.log("Respuesta para 'Me gustaría una hamburguesa con cheddar y panceta':", result2);

    // Ejemplo 3: Usuario pide un producto que no está en el menú
    const query3 = "Quiero una Vegan Burger";
    const result3 = await consultChatGPT(query3);
    console.log("Respuesta para 'Quiero una Vegan Burger':", result3);

    const query4 = "Quiero una hamburguesa con pollo y algo para tomar";
    const result4 = await consultChatGPT(query4);
    console.log("Respuesta para 'Quiero una hamburguesa con pollo y algo para tomar':", result4);
}

main();
