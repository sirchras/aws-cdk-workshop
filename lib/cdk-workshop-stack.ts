import { Construct, Stack, StackProps, CfnOutput } from '@aws-cdk/core'
import * as lambda from '@aws-cdk/aws-lambda'
import * as apigw from '@aws-cdk/aws-apigateway'
import { TableViewer } from 'cdk-dynamo-table-viewer'

import { HitCounter } from './hitcounter'

export class CdkWorkshopStack extends Stack {
  public readonly hcEndpoint: CfnOutput;
  // public readonly hcViewerURL: CfnOutput;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    const hello = new lambda.Function(this, 'HelloHandler', {
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'hello.handler'
    })

    const helloWithCounter = new HitCounter(this, 'HelloHitCounter', {
      downstream: hello
    })

    const gateway = new apigw.LambdaRestApi(this, 'Endpoint', {
      handler: helloWithCounter.handler
    })

    // const tv = new TableViewer(this, 'ViewHitCounter', {
    //   title: 'Hello Hits',
    //   table: helloWithCounter.table,
    //   sortBy: '-hits'
    // })

    this.hcEndpoint = new CfnOutput(this, 'GatewayURL', {
      value: gateway.url
    })

    // this.hcViewerURL = new CfnOutput(this, 'TableViewerURL', {
    //   value: tv.endpoint
    // })
  }
}
