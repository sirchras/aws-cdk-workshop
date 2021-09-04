import * as cdk from '@aws-cdk/core';
import * as codecommit from '@aws-cdk/aws-codecommit';

export class WorkshopPipelineStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new codecommit.Repository(this, 'WorkshopRepo', {
      repositoryName: 'WorkshopRepo'
    });
  }
}
