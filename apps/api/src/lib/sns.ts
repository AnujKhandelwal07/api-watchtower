import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";

const snsClient = new SNSClient({
  region: process.env.AWS_REGION ?? "ap-south-1",
});

export async function publishAlertToSNS(payload: {
  providerId: string;
  providerName: string;
  diffId: string;
  message: string;
}): Promise<string | undefined> {
  const topicArn = process.env.SNS_ALERTS_TOPIC_ARN;

  if (!topicArn) {
    console.warn("[sns] SNS_ALERTS_TOPIC_ARN not set — skipping publish");
    return undefined;
  }

  const command = new PublishCommand({
    TopicArn: topicArn,
    Subject: `[API Watchtower] Change detected: ${payload.providerName}`,
    Message: JSON.stringify(
      {
        providerId: payload.providerId,
        providerName: payload.providerName,
        diffId: payload.diffId,
        message: payload.message,
        timestamp: new Date().toISOString(),
      },
      null,
      2
    ),
    MessageAttributes: {
      type: {
        DataType: "String",
        StringValue: "CHANGE_DETECTED",
      },
    },
  });

  const response = await snsClient.send(command);
  return response.MessageId;
}