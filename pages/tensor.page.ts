import { Page, Locator } from '@playwright/test';

const DATA_TITLE = 'Exclusive or'; // Title of the dataset used can be updated to test different datasets.
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
        await this.page.getByTitle(DATA_TITLE).click();
    }

    async verifySelectedDataset(): Promise<boolean> {
        const classAttr = await this.page.getByTitle(DATA_TITLE).locator('canvas').getAttribute('class');
        return (classAttr ?? '').includes('selected');
    }

    // Method to set the noise level by filling the slider input.
    async setNoiseLevel(percent: number) {
        await this.noiseSlider.fill(String(percent));
    }

    featureToggle(name: FeatureName): Locator {
        return this.page.locator(`#canvas-${name}`);
    }

    private featureNode(name: FeatureName): Locator {
        return this.page.locator(`#node${name}`);
    }

    /** Clicking flips the feature's state - it is a toggle, not a one-way select. */
    async toggleFeature(name: FeatureName) {
        await this.featureToggle(name).click();
    }

    async getFeatureState(name: FeatureName): Promise<boolean> {
        const classAttr = await this.featureNode(name).getAttribute('class');
        return (classAttr ?? '').split(/\s+/).includes('active');
    }

    async setNeuronCount(layerIndex: number) {
        const layer = this.neuronControls.nth(layerIndex);
        const currentCountText = await layer.locator('> div:last-child').textContent();
        const currentCount = Number(currentCountText?.replace(/[^\d]/g, '') ?? '0'); // Remove me i am for debugging only
        await layer.getByRole('button', { name: 'remove' }).click();
        //console.log(`Setting neuron count for layer ${layerIndex}: current=${currentCount}, target=${count}`);
    }

    async getEpoch(): Promise<number> {
        const epochText = await this.epochLabel.textContent();
        //console.log('Raw epoch text:', JSON.stringify(epochText));
        return Number(epochText.replace(/[^\d]/g, '') ?? '0');
    }


    async getTestLoss(): Promise<number> {
        return Number(await this.testLossValue.textContent());
    }
}
