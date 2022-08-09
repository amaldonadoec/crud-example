import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import AWSProvider from '../providers/aws/Aws.provider';

@Injectable()
export class ExampleListener {
  constructor(
    private configService: ConfigService,
    private awsProvider: AWSProvider,
  ) {}

  public consumer = async () => {
    const queue = this.configService.get('aws.exampleSqsUrl');
    this.awsProvider.readQueues(queue, async () => {
      console.log('Message read....');
    });
  };
}
