import { test, expect } from '@playwright/test';
import { TensorPage } from '../pages/tensor.page';

// Constants for the test configuration
const NoiseLevel = 5;
const LearningRate = '0.1';

test.describe('TensorFlow Schneider run', () => {
  test('record test loss with four features enabled x1,x2,xsquare,x2square', async ({ page }) => {
    const tensorflow = new TensorPage(page);
    await tensorflow.goto();
    await expect(tensorflow.startStopButton).toBeVisible();

    // Baseline loss on initial load, before any configuration changes.
    const initialTestLossValue = await tensorflow.getTestLoss();
    console.log(`Initial test loss: ${initialTestLossValue}`);

    // Set learning rate to 0.1 and verify the selection.
    await tensorflow.setLearningRate(LearningRate);
    await expect(tensorflow.learningRateSelect).toHaveValue(LearningRate);

    // Select the dataset and verify that it is selected.
    await tensorflow.selectDataset();
    const isSelected = await tensorflow.verifySelectedDataset();
    await expect(isSelected).toBe(true);


    await tensorflow.setNoiseLevel(NoiseLevel);
    await expect(tensorflow.noiseSlider).toHaveValue(String(NoiseLevel));

    // Set the noise level and verify the selection.
    await tensorflow.toggleFeature('xSquared');
    await tensorflow.toggleFeature('ySquared');
    await expect.poll(() => tensorflow.getFeatureState('xSquared')).toBe(true); // Verify that the xSquared feature is active
    await expect.poll(() => tensorflow.getFeatureState('ySquared')).toBe(true); // Verify that the ySquared feature is active

    // Validation check to see the expected default neuron values for the first and second layers before any changes are made.
    expect( await tensorflow.getNeuronCount(0)).toBe(4);
    expect( await tensorflow.getNeuronCount(1)).toBe(2);

    // Set the number of neurons in the first and second layers and verify the counts.
    await tensorflow.setNeuronCount(0); // Set first index layer to 3 neurons
    expect( await tensorflow.getNeuronCount(0)).toBe(3);
    await tensorflow.setNeuronCount(1); // Set second index layer to 1 neuron
    expect(await tensorflow.getNeuronCount(1)).toBe(1);

    // Start the training process and wait until the epoch reaches 0.3, then stop the training.
    await tensorflow.startStopButton.click();
    await expect(tensorflow.startStopButton).toHaveClass(/playing/);
    let epoch = await tensorflow.getEpoch();
    while (epoch <= 300) {
        await page.waitForTimeout(200); // Wait for 200 milliseconds before checking the epoch again
        epoch = await tensorflow.getEpoch();
    }
    await tensorflow.startStopButton.click();
    await expect(tensorflow.startStopButton).not.toHaveClass(/playing/);
    console.log(`Current epoch after stop: ${epoch}`);

    // Final test loss after training with the configured settings.
    const finalTestLossvalue = await tensorflow.getTestLoss();
    console.log(`Final test loss after training: ${finalTestLossvalue}`);

  });

});
