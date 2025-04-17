// /api/integrations/wa/webhook

import { WAWebhook } from "@/types/WA";
import { NextRequest } from "next/server";

// verify webhook route
export function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const mode = searchParams.get("hub.mode");
    const token = searchParams.get("hub.verify_token");
    const challenge = searchParams.get("hub.challenge");
  
    if (mode === "subscribe" && token === process.env.WEBHOOK_VERIFY_TOKEN) {
      console.log("Webhook verified successfully!");
      return new Response(challenge, { status: 200 });
    } else {
      return new Response("Forbidden", { status: 403 });
    }
  }
  
// Handle webhook events
export async function POST(req: NextRequest) {
  const body: WAWebhook = await req.json();

  console.log("Incoming webhook message:", JSON.stringify(body, null, 2));

  const message = body.entry?.[0]?.changes[0]?.value?.messages?.[0];

  if (message?.type === "text") {
    // const business_phone_number_id =
    //   body.entry[0].changes[0].value.metadata.phone_number_id;
    const business_phone_number_id = "610837242116223"

    try {
      const headers = {
        Authorization: `Bearer ${process.env.GRAPH_API_TOKEN}`,
        "Content-Type": "application/json",
      };

      console.log({headers, business_phone_number_id, text: { body: "Echo: " + message.text.body }, from: message.from})

      // Enviar respuesta
      const res = await fetch(
        `https://graph.facebook.com/v22.0/${business_phone_number_id}/messages`,
        {
          method: "POST",
          headers,
          body: JSON.stringify({
            messaging_product: "whatsapp",
            to: message.from,
            text: { body: "Echo: " + message.text.body },
            context: {
              message_id: message.id,
            },
          }),
        }
      );

      if (!res.ok) {
        const text = await res.text();
        console.error(`Request failed: ${res.status}`);
        console.log(text)
      }

      // Marcar mensaje como leído
      await fetch(
        `https://graph.facebook.com/v18.0/${business_phone_number_id}/messages`,
        {
          method: "POST",
          headers,
          body: JSON.stringify({
            messaging_product: "whatsapp",
            status: "read",
            message_id: message.id,
          }),
        }
      );
    } catch (error) {
      console.error("Error sending message:", error);
    }
  }

  return new Response(null, { status: 200 });
}
