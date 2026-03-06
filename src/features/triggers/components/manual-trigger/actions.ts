"use server";
import { getSubscriptionToken, type Realtime } from "@inngest/realtime";
import { manualTriggerChannel } from "@/inngest/channels/manual-trigger";
import { inngest } from "@/inngest/client";

export type ManualTriggerToken = Realtime.Token<
        typeof manualTriggerChannel,
        ["status"]
    >;

/**
 * Obtain a realtime subscription token for the manual trigger channel's "status" topic.
 *
 * @returns The subscription token scoped to the manual trigger channel for the `"status"` topic.
 */
export async function fetchManualTriggerRealTimeToken():
Promise<ManualTriggerToken>{
    const Token = await getSubscriptionToken(inngest, {
        channel: manualTriggerChannel(),
        topics: ["status"],
    });
    return Token;
}   