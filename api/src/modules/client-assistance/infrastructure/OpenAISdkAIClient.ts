import OpenAI from "openai";
import logger from "../../../logger";
import { SimplifiedProduct } from "../../products/core/domain/SimplifiedProduct";
import { AssistanceMessage, AssistanceAction, ActionType } from "../core/domain/Action";
import { AIClient } from "../core/domain/AIClient";

export class OpenAISdkAIClient implements AIClient {

    private client: OpenAI;

    constructor() {
        this.client = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });
    }

    async consult(messages: AssistanceMessage[]): Promise<{ message: AssistanceMessage; action: AssistanceAction; }> {
        try {
            // Llama a la API de OpenAI con el historial de mensajes
            const response = await this.client.chat.completions.create({
                model: 'gpt-4o',
                messages: messages.map(msg => ({
                    role: msg.role,
                    content: msg.content
                })),
                max_tokens: 150, // Limita el número de tokens en la respuesta
            });

            const assistantMessage = response.choices[0].message.content || "";

            return {
                message: {
                    role: "assistant",
                    content: assistantMessage,
                },
                action: this.extractAction(assistantMessage),
            };
        } catch (error: any) {
            logger.error("Error al llamar a la API de OpenAI:", error.response ? error.response.data : error.message);
            throw error;
        }
    }

    getInitialMessage(menu: SimplifiedProduct[]): AssistanceMessage {
        return {
            role: "system",
            content: `Eres un asistente virtual encargado de ayudar a los clientes a seleccionar productos de un menú de hamburguesas. Debes seguir estrictamente el formato JSON que se indica a continuación en todas tus respuestas:

            1. Para sugerir o seleccionar productos del menú, debes usar este formato:
            {
            "type": "select_products" o "suggest_products",
            "products": [
                {
                "id": number,
                "removedIngredients": [
                    {
                    "id": number,
                    "quantity": number
                    }
                ]
                }
            ],
            "response": "string"
            }
            - El listado de "products" debe contener al menos un producto y como máximo 3.
            - En cada nueva selección de productos, no debes incluir productos seleccionados previamente. Cada comando debe contener solo la nueva información.
            - Si el cliente remueve ingredientes de un producto, asegúrate de que el ingrediente y la cantidad sean válidos para ese producto. Solo debes permitir la remoción de ingredientes que realmente existan en el producto seleccionado.

            2. Para aclarar dudas o dar respuestas sin sugerir productos, usa este formato:
            {
            "type": "message",
            "response": "string"
            }

            3. Al finalizar la compra, debes usar este formato:
            {
            "type": "pay",
            "method": "mercadopago" o "en_caja",
            "response": "string"
            }

            Reglas importantes:
            - Asegúrate de que todas tus respuestas sean JSON válidos, compatibles con 'JSON.parse', bien formados y sin comas innecesarias.
            - No incluyas texto fuera del JSON.
            - Puedes sugerir hasta 3 productos en una sola respuesta.
            - Cuando el cliente confirme una selección, pregunta si quiere algo más. Si no lo desea, despídete amablemente.
            - Evita usar el formato "message" para sugerir productos o iniciar una selección.
            - No proporciones el menú completo al cliente, ya que puede verlo. Limítate a sugerir o seleccionar en función de lo que pide.
            - Asegúrate de estar al 90% seguro antes de seleccionar productos.
            - Mantén las respuestas al cliente cortas, claras y de menos de 300 caracteres.
            - Finaliza siempre preguntando el método de pago si no es mencionado por el cliente.
            - **Verifica siempre que los ingredientes y la cantidad que el cliente desea remover existan en el producto seleccionado antes de proceder con la modificación.** Si no existen, devuelve un mensaje solicitando que corrija la selección de ingredientes.
            - Pregunta el método de pago si el cliente no lo menciona. **Debes estar seguro de que el cliente haya decidido como pagar antes de finalizar la compra.**

            Ejemplo de interacción:
            Usuario:
            - Hola, me gustaría una hamburguesa con queso.

            Asistente:
            \`\`\`json
            {
            "type": "suggest_products",
            "products": [
                {
                "id": 1,
                "removedIngredients": []
                }
            ],
            "response": "Te sugiero la hamburguesa clásica con queso. ¿Te interesa?"
            }
            \`\`\`

            Usuario:
            - Quiero la hamburguesa doble con queso.

            Asistente:
            \`\`\`json
            {
            "type": "select_products",
            "products": [
                {
                "id": 2,
                "removedIngredients": []
                }
            ],
            "response": "He seleccionado la hamburguesa doble con queso. ¿Deseas algo más?"
            }
            \`\`\`

            Usuario:
            - No, procedo a pagar.

            Asistente:
            \`\`\`json
            {
            "type": "message",
            "response": "¿Cómo deseas pagar? ¿Con Mercado Pago? ¿O en caja con efectivo o tarjeta?"
            }
            \`\`\`

            Usuario:
            - Con Mercado Pago.

            Asistente:
            \`\`\`json
            {
            "type": "pay",
            "method": "mercadopago",
            "response": "Procediendo con la compra, que la disfrutes."
            }
            \`\`\`

            Aquí tienes el menú: ${JSON.stringify(menu)}
            `,
        };
    }


    private extractAction(message: string): AssistanceAction {
        try {
            // Parseamos el contenido del mensaje como JSON
            message = message.replace('```json', '').replace('```', '');
            const parsedMessage = JSON.parse(message);

            // Verificamos si el tipo de acción es `SUGGEST_PRODUCTS` o `SELECT_PRODUCTS`
            if (parsedMessage.type === "suggest_products") {
                return {
                    type: ActionType.SUGGEST_PRODUCTS,
                    products: parsedMessage.products.map((product: any) => ({
                        id: product.id,
                        removedIngredients: product.removedIngredients.map((ingredient: any) => ({
                            id: ingredient.id,
                            quantity: ingredient.quantity,
                        })),
                    })),
                    response: parsedMessage.response,
                };
            } else if (parsedMessage.type === "select_products") {
                return {
                    type: ActionType.SELECT_PRODUCTS,
                    products: parsedMessage.products.map((product: any) => ({
                        id: product.id,
                        removedIngredients: product.removedIngredients.map((ingredient: any) => ({
                            id: ingredient.id,
                            quantity: ingredient.quantity,
                        }))
                    })),
                    response: parsedMessage.response,
                };
            } else if (parsedMessage.type === "message") {
                return {
                    type: ActionType.MESSAGE,
                    response: parsedMessage.response,
                };
            } else if (parsedMessage.type === 'pay') {
                return {
                    type: ActionType.PAY,
                    method: parsedMessage.method,
                    response: parsedMessage.response,
                };
            } else {
                throw new Error("Tipo de acción no reconocido en la respuesta de la IA.");
            }
        } catch (error) {
            logger.error("Error al extraer la acción del mensaje:", error);
            throw new Error("Error al procesar la acción en el mensaje de la IA.");
        }
    }

}
