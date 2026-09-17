import { Page, Locator } from '@playwright/test';

export const DataTitle = 'Exclusive or'; // Title of the dataset used can be updated to test different datasets.
export type FeatureName = 'xSquared' | 'ySquared';

export class TensorPage {
    readonly page: Page;

    // Toolbar Locators
    readonly startStopButton: Locator;
    readonly epochLabel: Locator;
    readonly learningRateSelect: Locator;

    // Noise Slider
    readonly noiseSlider: Locator;

    // Neurons
    readonly neuronControls: Locator;

    // Test Loss value
    readonly testLossValue: Locator;

    constructor(page: Page) {
        this.page = page;

        this.startStopButton = page.getByTitle('Run/Pause');
        this.epochLabel = page.locator('#iter-number');
        this.learningRateSelect = page.getByRole('combobox', { name: 'Learning rate' });
        this.noiseSlider = page.getByRole('slider', { name: 'Noise', exact: false });
        this.neuronControls = page.locator('div.plus-minus-neurons');
        this.testLossValue = page.locator('#loss-test');
    }

    async goto() {
        await this.page.goto('https://playground.tensorflow.org');
    }

    // Method to set the learning rate by selecting an option from the dropdown.
    async setLearningRate(value: string) {
        await this.learningRateSelect.selectOption(value);
    }

    // Method to select a dataset by clicking on the dataset title.
    async selectDataset() {
        await this.page.getByTitle(DataTitle).click();
    }

    async verifySelectedDataset(): Promise<boolean> {
        const classAttr = await this.page.getByTitle(DataTitle).locator('canvas').getAttribute('class');
        return (classAttr ?? '').includes('selected');
    }

    // Method to set the noise level by filling the slider input.
    async setNoiseLevel(percent: number) {
        await this.noiseSlider.fill(String(percent));
    }

    // Feature toggling methods
    featureToggle(name: FeatureName): Locator {
        return this.page.locator(`#canvas-${name}`);
    }

    // Method to get the feature node by name, which is used to check the feature's state.
    private featureNode(name: FeatureName): Locator {
        return this.page.locator(`#node${name}`);
    }

    // Method to toggle a feature on or off by clicking on its corresponding toggle button.
    async toggleFeature(name: FeatureName) {
        await this.featureToggle(name).click();
    }

    // Method to check if a feature is currently active by examining its class attribute.
    async getFeatureState(name: FeatureName): Promise<boolean> {
        const classAttr = await this.featureNode(name).getAttribute('class');
        return (classAttr ?? '').split(/\s+/).includes('active');
    }

    // Method to set the number of neurons by clicking the remove button.
    async setNeuronCount(layerIndex: number) {
        const layer = this.neuronControls.nth(layerIndex);
        await layer.getByRole('button', { name: 'remove' }).click();
    }

    // Method to get the current epoch number by extracting the numeric part from the epoch label's text content.
    async getEpoch(): Promise<number> {
        const epochText = await this.epochLabel.textContent();
        //console.log('Raw epoch text:', JSON.stringify(epochText));
        return Number(epochText.replace(/[^\d]/g, '') ?? '0');
    }

    // Method to get the current test loss value.
    async getTestLoss(): Promise<number> {
        return Number(await this.testLossValue.textContent());
    }
}
