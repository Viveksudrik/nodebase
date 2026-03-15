"use server";
import { getSubscriptionToken, type Realtime } from "@inngest/realtime";
import { inngest } from "@/inngest/client";
import { anthropicChannel } from "@/inngest/channels/anthropic";

export type AnthropicToken = Realtime.Token<
        typeof anthropicChannel,
        ["status"]
    >;

export async function fetchAnthropicRealTimeToken():
Promise<AnthropicToken>{
    const Token = await getSubscriptionToken(inngest, {
        channel: anthropicChannel(),
        topics: ["status"],
    });
    return Token;
}
