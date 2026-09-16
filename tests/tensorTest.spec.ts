import { test, expect } from '@playwright/test';
import { TensorPage } from '../pages/tensor.page';

test.describe('TensorFlow Schneider run', () => {
  test('record test loss with four features enabled x1,x2,xsquare,x2square', async ({ page }) => {
    const tensorflow = new TensorPage(page);
    await tensorflow.goto();

    // Baseline loss on initial load, before any configuration changes.
    const initialTestLossValue = await tensorflow.getTestLoss();
    console.log(`Initial test loss: ${initialTestLossValue}`);

    // Set learning rate to 0.1 and verify the selection.
    await tensorflow.setLearningRate('0.1');
    await expect(tensorflow.learningRateSelect).toHaveValue('0.1');

    // Select the dataset and verify that it is selected.
    await tensorflow.selectDataset();
    const isSelected = await tensorflow.verifySelectedDataset();
    await expect(isSelected).toBe(true);


    await tensorflow.setNoiseLevel(5);
    await expect(tensorflow.noiseSlider).toHaveValue('5');

    // Set the noise level and verify the selection.
    await tensorflow.toggleFeature('xSquared');
    await tensorflow.toggleFeature('ySquared');
    //expect(await tensorflow.getFeatureState('xSquared')).toBe(true);
    //expect(await tensorflow.getFeatureState('ySquared')).toBe(true);
    await expect.poll(() => tensorflow.getFeatureState('xSquared')).toBe(true);
    await expect.poll(() => tensorflow.getFeatureState('ySquared')).toBe(true);

    // Set the number of neurons in the first and second layers and verify the counts.
    await tensorflow.setNeuronCount(0); // Set first layer to 3 neurons
    expect(await tensorflow.neuronControls.nth(0).locator('> div:last-child').textContent()).toContain('3');
    await tensorflow.setNeuronCount(1); // Set second layer to 1 neuron
    expect(await tensorflow.neuronControls.nth(1).locator('> div:last-child').textContent()).toContain('1');

    // Start the training process and wait until the epoch reaches 0.3, then stop the training.
    await tensorflow.startStopButton.click();
    await expect(tensorflow.startStopButton).toHaveClass(/playing/);
    //expect(await tensorflow.startStopButton.getAttribute('title')).toBe('Pause');
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
