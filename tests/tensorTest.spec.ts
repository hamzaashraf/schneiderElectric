import { test, expect } from '@playwright/test';
import { TensorPage } from '../pages/tensor.page';

test.describe('TensorFlow Schneider run', () => {
  test('record test loss with four features enabled x1,x2,xsquare,x2square', async ({ page }) => {
    const tensorflow = new TensorPage(page);
    await tensorflow.goto();

    // Baseline loss on initial load, before any configuration changes.
    const initialTestLossValue = await tensorflow.getTestLoss();
    console.log(`Initial test loss: ${initialTestLossValue}`);

    await tensorflow.setLearningRate('0.1');
    await expect(tensorflow.learningRateSelect).toHaveValue('0.1');

    await tensorflow.selectDataset();
    const isSelected = await tensorflow.verifySelectedDataset();
    await expect(isSelected).toBe(true);


    await tensorflow.setNoiseLevel(5);
    await expect(tensorflow.noiseSlider).toHaveValue('5');

    // Final test loss after training with the configured settings.
    const finalTestLossvalue = await tensorflow.getTestLoss();
    console.log(`Final test loss after training: ${finalTestLossvalue}`);

  });
});
