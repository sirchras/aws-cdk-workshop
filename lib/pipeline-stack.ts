import * as cdk from '@aws-cdk/core';
import * as codecommit from '@aws-cdk/aws-codecommit';
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as actions from '@aws-cdk/aws-codepipeline-actions';
import { SimpleSynthAction, CdkPipeline, ShellScriptAction } from '@aws-cdk/pipelines';

import { WorkshopPipelineStage } from './pipeline-stage';

export class WorkshopPipelineStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const repo = new codecommit.Repository(this, 'WorkshopRepo', {
      repositoryName: 'WorkshopRepo'
    });

    const sourceArtifact = new codepipeline.Artifact();
    const cloudAssemblyArtifact = new codepipeline.Artifact();

    const pipeline = new CdkPipeline(this, 'Pipeline', {
      pipelineName: 'WorkshopPipeline',
      cloudAssemblyArtifact,
      sourceAction: new actions.CodeCommitSourceAction({
        actionName: 'CodeCommit',
        output: sourceArtifact,
        repository: repo
      }),
      synthAction: SimpleSynthAction.standardNpmSynth({
        sourceArtifact,
        cloudAssemblyArtifact,
        buildCommand: 'npm run build'
      })
    });

    const deploy = new WorkshopPipelineStage(this, 'Deploy');
    const deployStage = pipeline.addApplicationStage(deploy);
    deployStage.addActions(new ShellScriptAction({
      actionName: 'TestAPIGatewayEndpoint',
      useOutputs: {
        ENDPOINT_URL: pipeline.stackOutput(deploy.hcEndpoint)
      },
      commands: [
        'curl -Ssf $ENDPOINT_URL/',
        'curl -Ssf $ENDPOINT_URL/hello',
        'curl -Ssf $ENDPOINT_URL/test'
      ]
    }));
  }
}
