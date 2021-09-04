import { CdkWorkshopStack } from "./cdk-workshop-stack";
import { Stage, Construct, StageProps, CfnOutput } from "@aws-cdk/core";

export class WorkshopPipelineStage extends Stage {
  public readonly hcEndpoint: CfnOutput;

  constructor(scope: Construct, id: string, props?: StageProps) {
    super(scope, id, props);

    const service = new CdkWorkshopStack(this, 'WebService');

    this.hcEndpoint = service.hcEndpoint;
  }
}
