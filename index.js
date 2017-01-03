import {
  Neuron,
  Layer,
  Network,
  Trainer,
  Architect
} from 'synaptic';
import DataProvider from './data_provider';
import NetworkEvaluator from './network_evaluator';
import GeneticTrainer from './genetic_trainer';

const INPUT_LAYER_SIZE = 4;
const HIDDEN_LAYER_SIZE = 6;
const OUTPUT_LAYER_SIZE = 3;

const dataProvider = new DataProvider();
const trainingSet = dataProvider.getTrainingSet();
const testSet = dataProvider.getTestSet();

const inputLayer = new Layer(INPUT_LAYER_SIZE);
const hiddenLayer = new Layer(HIDDEN_LAYER_SIZE);
const outputLayer = new Layer(OUTPUT_LAYER_SIZE);

inputLayer.project(hiddenLayer);
hiddenLayer.project(outputLayer);

const network = new Network({
  input: inputLayer,
  hidden: [hiddenLayer],
  output: outputLayer,
});
network.setOptimize(false);

const trainer = new Trainer(network);
trainer.train(trainingSet, {
  rate: .1,
  iterations: 20000,
  error: .03,
  shuffle: true,
  log: 1,
  cost: Trainer.cost.MSE
});

const networkEvaluator = new NetworkEvaluator(network, testSet);
networkEvaluator.evaluate();

const geneticTrainer = new GeneticTrainer(network);
geneticTrainer.train(trainingSet);

networkEvaluator.evaluate();
