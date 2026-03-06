"use server";
import { getSubscriptionToken, type Realtime } from "@inngest/realtime";
import { httpRequestChannel } from "@/inngest/channels/http-request";
import { inngest } from "@/inngest/client";

export type HttpRequestToken = Realtime.Token<
        typeof httpRequestChannel,
        ["status"]
    >;

/**
 * Obtain a subscription token for realtime "status" updates on the HTTP request channel.
 *
 * @returns A `HttpRequestToken` granting subscription to the `httpRequestChannel` for the `"status"` topic.
 */
export async function fetchHttpRequestRealTimeToken():
Promise<HttpRequestToken>{
    const Token = await getSubscriptionToken(inngest, {
        channel: httpRequestChannel(),
        topics: ["status"],
    });
    return Token;
}