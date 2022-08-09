import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';
import { Consumer } from 'sqs-consumer';

@Injectable()
export default class AWSProvider {
  private static instance: AWSProvider;
  private sqs: AWS.SQS.Types;
  private sns: AWS.SNS.Types;

  constructor(private configService: ConfigService) {
    AWS.config.update({
      accessKeyId: this.configService.get('aws.accessKeyId'),
      secretAccessKey: this.configService.get('aws.secretAccessKey'),
      region: this.configService.get('aws.region'),
    });
    this.sqs = new AWS.SQS();
    this.sns = new AWS.SNS();

    // Validate that there is only one instance
    if (typeof AWSProvider.instance === 'object') {
      return AWSProvider.instance;
    }
    AWSProvider.instance = this;
    return this;
  }
  /**
   * Read a AWS Queue and run the callback function by sqs-consumer
   * @param {string} queue
   * @param {(message: AWS.SQS.Message) => Promise<void>} callback
   * @returns {Promise<Consumer>}
   */
  public readQueues = async (
    queue: string,
    callback: (message: AWS.SQS.Message) => Promise<void>,
  ): Promise<Consumer> => {
    console.log(`Ready to Read ${queue}`);
    const app = Consumer.create({
      queueUrl: queue,
      handleMessage: async (message) => {
        await callback(message);
      },
      visibilityTimeout: 60,
      waitTimeSeconds: 0,
      pollingWaitTimeMs: 0,
      sqs: this.sqs,
    });

    // Fired when an error occurs interacting with the queue.
    app.on('error', (err) => {
      console.error(err.message);
    });

    // Fired when an error occurs processing the message.
    app.on('processing_error', (err) => {
      console.error(err.message);
    });

    // Start polling the queue for messages.
    app.start();

    return app;
  };

  /**
   * Send a message to a AWS Topic
   * @param {string} subject
   * @param {any} data
   * @param {string} topicArn
   */
  public publishTopic = async (
    subject: string,
    data: any,
    topicArn: string,
  ) => {
    const params: AWS.SNS.PublishInput = {
      Message: JSON.stringify(data),
      TopicArn: topicArn,
      Subject: subject,
    };
    this.sns.publish(
      params,
      (err: AWS.AWSError, data: AWS.SNS.PublishResponse) => {
        if (err) {
          // In case of error
          console.log(`Error sending message to ${topicArn}`);
        } else {
          // In case of success
          console.log(`Message sent: ${data.MessageId}`);
        }
      },
    );
  };
}
