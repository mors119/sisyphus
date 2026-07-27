import {
  ExpansionPipelineSnapshot,
  ExpansionStageId,
  ExpansionStageSnapshot,
} from './expansion.types';
import {
  inferFailStagesFromWord,
  runExpansionPipeline,
  RunExpansionOptions,
} from './expansion.service';

export type StartExpansionOptions = {
  failStages?: ExpansionStageId[];
  signal?: AbortSignal;
  onUpdate: RunExpansionOptions['onUpdate'];
};

export function startExpansionPipeline(
  word: string,
  options: StartExpansionOptions,
): Promise<ExpansionPipelineSnapshot> {
  return runExpansionPipeline(word, {
    failStages: options.failStages ?? inferFailStagesFromWord(word),
    signal: options.signal,
    onUpdate: options.onUpdate,
  });
}

export function retryExpansionStage(
  word: string,
  stageId: ExpansionStageId,
  preservedStages: ExpansionStageSnapshot[],
  options: StartExpansionOptions,
): Promise<ExpansionPipelineSnapshot> {
  return runExpansionPipeline(word, {
    ...options,
    startFrom: stageId,
    preserve: preservedStages.filter((stage) => stage.status === 'completed'),
    failStages: options.failStages ?? [],
  });
}
