import { Construct, Stack, StackProps } from '@aws-cdk/core'
import * as lambda from '@aws-cdk/aws-lambda'
import * as apigw from '@aws-cdk/aws-apigateway'
// import { TableViewer } from 'cdk-dynamo-table-viewer'

import { HitCounter } from './hitcounter'

export class CdkWorkshopStack extends Stack {
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

    new apigw.LambdaRestApi(this, 'Endpoint', {
      // handler: hello
      handler: helloWithCounter.handler
    })

    // new TableViewer(this, 'ViewHitCounter', {
    //   title: 'Hello Hits',
    //   table: helloWithCounter.table,
    //   sortBy: '-hits'
    // })
  }
}
