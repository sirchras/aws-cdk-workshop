import { expect as expectCDK, haveResource, stringLike } from "@aws-cdk/assert";
import cdk = require('@aws-cdk/core');
import * as lambda from '@aws-cdk/aws-lambda';

import { HitCounter } from "../lib/hitcounter";

test('DynamoDB table created with encryption', () => {
  const stack = new cdk.Stack();

  new HitCounter(stack, 'TestConstruct', {
    downstream: new lambda.Function(stack, 'TestFunction', {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'lambda.handler',
      code: lambda.Code.fromInline('test')
    })
  });

  expectCDK(stack).to(haveResource('AWS::DynamoDB::Table', {
    SSESpecification: { SSEEnabled: true }
  }));
});

test('Lambda function created with env vars', () => {
  const stack = new cdk.Stack();

  new HitCounter(stack, 'TestConstruct', {
    downstream: new lambda.Function(stack, 'TestFunction', {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'lambda.handler',
      code: lambda.Code.fromInline('test')
    })
  });

  expectCDK(stack).to(haveResource('AWS::Lambda::Function', {
    Environment: {
      Variables: {
        // DOWNSTREAM_FUNCTION_NAME: { Ref: 'TestFunction22AD90FC' },
        DOWNSTREAM_FUNCTION_NAME: { Ref: stringLike('TestFunction*') },
        HITS_TABLE_NAME: { Ref: stringLike('TestConstructHits*') }
      }
    }
  }));
});

test('read capacity can be configured', () => {
  const stack = new cdk.Stack();

  expect(() => {
    new HitCounter(stack, 'TestConstruct', {
      downstream: new lambda.Function(stack, 'TestFunction', {
        runtime: lambda.Runtime.NODEJS_14_X,
        handler: 'lambda.handler',
        code: lambda.Code.fromInline('test')
      }),
      readCapacity: 3
    });
  }).toThrowError('readCapacity must be between 5 and 20 (inclusive)');
})
