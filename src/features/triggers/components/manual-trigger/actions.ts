"use server";
import { getSubscriptionToken, type Realtime } from "@inngest/realtime";
import { manualTriggerChannel } from "@/inngest/channels/manual-trigger";
import { inngest } from "@/inngest/client";

export type ManualTriggerToken = Realtime.Token<
        typeof manualTriggerChannel,
        ["status"]
    >;

export async function fetchManualTriggerRealTimeToken():
Promise<ManualTriggerToken>{
    const Token = await getSubscriptionToken(inngest, {
        channel: manualTriggerChannel(),
        topics: ["status"],
    });
    return Token;
}   